"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

const QuizWebcamAnalyzer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [stopSdk, setStopSdk] = useState<(() => void) | null>(null);

  const setCameraStatus = useStore((state) => state.setCameraStatus);
  const setEmotionData = useStore((state) => state.setEmotionData);
  const setAttentionData = useStore((state) => state.setAttentionData);
  const isCameraOn = useStore((state) => state.isCameraOn);

  const startCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setCameraStatus(true); // Notify global state that camera is on
    } catch (error) {
      console.error("Error starting camera: ", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (stopSdk) {
        stopSdk();
      }
      setCameraStatus(false); // Notify global state that camera is off
      setEmotionData(null);
      setAttentionData(null);
    }
  };

  useEffect(() => {
    const loadScript = (
      src: string,
      dataConfig: string | null = null
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        if (dataConfig) {
          script.setAttribute("data-config", dataConfig);
        }
        script.src = src;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      });
    };

    const downloadAiSDK = async () => {
      await loadScript(
        "https://sdk.morphcast.com/mphtools/v1.1/mphtools.js",
        "cameraPrivacyPopup, compatibilityUI, compatibilityAutoCheck"
      );
      await loadScript(
        "https://sdk.morphcast.com/emotion-statistics/v1.0-beta/script.js"
      );
      await loadScript("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");
      return (window as any).CY;
    };

    const initializeSDK = async () => {
      if (stream) {
        const sdk = await downloadAiSDK();
        const options = {
          sendDatainterval: 5000,
          tickInterval: 1000,
          stopAfter: 7200000,
          licenseKey: process.env.NEXT_PUBLIC_MORPHCAST_LICENSE_KEY,
        };

        const statisticsUploader = new (
          window as any
        ).MorphCastStatistics.StatisticsUploader(options);

        sdk
          .loader()
          .licenseKey(options.licenseKey)
          .addModule(sdk.modules().FACE_AROUSAL_VALENCE.name, {
            smoothness: 0.7,
          })
          .addModule(sdk.modules().FACE_EMOTION.name, { smoothness: 0.4 })
          .addModule(sdk.modules().FACE_ATTENTION.name, { smoothness: 0.83 })
          .addModule(sdk.modules().ALARM_LOW_ATTENTION.name, {
            timeWindowMs: 5000,
            initialToleranceMs: 7000,
            threshold: 0.33,
          })
          .addModule(sdk.modules().FACE_WISH.name, { smoothness: 0.8 })
          .addModule(sdk.modules().FACE_POSE.name, { smoothness: 0.65 })
          .addModule(sdk.modules().FACE_AGE.name, { rawOutput: false })
          .addModule(sdk.modules().FACE_GENDER.name, {
            smoothness: 0.95,
            threshold: 0.7,
          })
          .addModule(sdk.modules().FACE_FEATURES.name, { smoothness: 0.9 })
          .addModule(sdk.modules().FACE_DETECTOR.name, {
            maxInputFrameSize: 320,
            smoothness: 0.83,
          })
          .addModule(sdk.modules().ALARM_MORE_FACES.name, {
            timeWindowMs: 3000,
            initialToleranceMs: 7000,
            threshold: 0.33,
          })
          .addModule(sdk.modules().ALARM_NO_FACE.name, {
            timeWindowMs: 10000,
            initialToleranceMs: 7000,
            threshold: 0.75,
          })
          .addModule(sdk.modules().DATA_AGGREGATOR.name, {
            initialWaitMs: 2000,
            periodMs: 1000,
          })
          .addModule(sdk.modules().FACE_POSITIVITY.name, {
            smoothness: 0.4,
            gain: 2,
            angle: 17,
          })
          .load()
          .then(
            async ({
              start,
              stop,
            }: {
              start: () => Promise<void>;
              stop: () => Promise<void>;
            }) => {
              await start();
              await statisticsUploader.start();
              setStopSdk(() => stop);
              setTimeout(async () => {
                await statisticsUploader.stop();
                await stop();
              }, options.stopAfter);
            }
          );

        // Event listeners for quiz face attention data
        let latestQuizAttentionData: any = null;
        let quizAttentionInterval: NodeJS.Timeout | null = null;

        window.addEventListener(
          sdk.modules().FACE_ATTENTION.eventName,
          (e: any) => {
            if (isCameraOn) {
              console.log("QUIZ FACE_ATTENTION event data:", e.detail);
              setAttentionData(e.detail);

              // Store the latest attention data
              latestQuizAttentionData = e.detail;

              // Start the interval if it's not already running
              if (!quizAttentionInterval) {
                quizAttentionInterval = setInterval(() => {
                  if (latestQuizAttentionData) {
                    try {
                      fetch("/api/upload-quiz-attention-data", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(latestQuizAttentionData),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          console.log("Quiz attention data sent to server:", data);
                          // Clear the interval after data is sent once
                          clearInterval(quizAttentionInterval as NodeJS.Timeout);
                          quizAttentionInterval = null;

                          // Restart the interval to ensure it continues to send data every 10 seconds
                          if (isCameraOn) {
                            quizAttentionInterval = setInterval(() => {
                              if (latestQuizAttentionData) {
                                try {
                                  fetch("/api/upload-quiz-attention-data", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(latestQuizAttentionData),
                                  })
                                    .then((response) => response.json())
                                    .then((data) => {
                                      console.log("Quiz attention data sent to server:", data);
                                      // Clear the interval after data is sent once
                                      clearInterval(
                                        quizAttentionInterval as NodeJS.Timeout
                                      );
                                      quizAttentionInterval = null;
                                    });
                                } catch (error) {
                                  console.error(
                                    "Error sending quiz attention data: ",
                                    error
                                  );
                                }
                              }
                            }, 10000);
                          }
                        });
                    } catch (error) {
                      console.error("Error sending quiz attention data: ", error);
                    }
                  }
                }, 10000); // 10000 milliseconds = 10 seconds
              }
            } else {
              // Clear the interval when the camera is off
              if (quizAttentionInterval) {
                clearInterval(quizAttentionInterval);
                quizAttentionInterval = null;
              }
            }
          }
        );

        // Event listeners for quiz face emotion data
        let latestQuizEmotionData: any = null;
        let quizEmotionInterval: NodeJS.Timeout | null = null;

        window.addEventListener(
          sdk.modules().FACE_EMOTION.eventName,
          (e: any) => {
            if (isCameraOn) {
              console.log("QUIZ FACE_EMOTION event data:", e.detail);
              setEmotionData(e.detail);

              // Store the latest emotion data
              latestQuizEmotionData = e.detail;

              // Start the interval if it's not already running
              if (!quizEmotionInterval) {
                quizEmotionInterval = setInterval(() => {
                  if (latestQuizEmotionData) {
                    try {
                      fetch("/api/upload-quiz-emotions-data", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(latestQuizEmotionData),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          console.log("Quiz emotion data sent to server:", data);
                          // Clear the interval after data is sent once
                          clearInterval(quizEmotionInterval as NodeJS.Timeout);
                          quizEmotionInterval = null;

                          // Restart the interval to ensure it continues to send data every 10 seconds
                          if (isCameraOn) {
                            quizEmotionInterval = setInterval(() => {
                              if (latestQuizEmotionData) {
                                try {
                                  fetch("/api/upload-quiz-emotions-data", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(latestQuizEmotionData),
                                  })
                                    .then((response) => response.json())
                                    .then((data) => {
                                      console.log("Quiz emotion data sent to server:", data);
                                      // Clear the interval after data is sent once
                                      clearInterval(
                                        quizEmotionInterval as NodeJS.Timeout
                                      );
                                      quizEmotionInterval = null;
                                    });
                                } catch (error) {
                                  console.error(
                                    "Error sending quiz emotion data: ",
                                    error
                                  );
                                }
                              }
                            }, 10000);
                          }
                        });
                    } catch (error) {
                      console.error("Error sending quiz emotion data: ", error);
                    }
                  }
                }, 10000); // 10000 milliseconds = 10 seconds
              }
            } else {
              // Clear the interval when the camera is off
              if (quizEmotionInterval) {
                clearInterval(quizEmotionInterval);
                quizEmotionInterval = null;
              }
            }
          }
        );

        (window as any).MphTools.CameraPrivacyPopup.setText({
          title: "Allow us to use your camera during the quiz",
          description:
            "This quiz is designed to be taken with your camera on. The next screen will ask your consent to access data from your camera.",
          url: "http://localhost:3000/privacy-policy",
        });
      }
    };

    if (typeof window !== "undefined" && stream) {
      initializeSDK();
    }

    // Cleanup function to stop the camera when component unmounts
    return () => {
      stopCamera();
    };
  }, [stream, isCameraOn, setCameraStatus, setEmotionData, setAttentionData]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
      <div className="relative w-full aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover border-2 border-gray-300 rounded-lg"
        />
      </div>
      <Button
        onClick={isCameraOn ? stopCamera : startCamera}
        variant={isCameraOn ? "danger" : "default"}
        className="mt-2"
      >
        {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
      </Button>
    </div>
  );
};

export default QuizWebcamAnalyzer;