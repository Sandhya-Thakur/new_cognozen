"use client";
import React, { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";

const QuizWebcamAnalyzer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [stopSdk, setStopSdk] = useState<(() => void) | null>(null);

  const setCameraStatus = useStore((state) => state.setCameraStatus);
  const setEmotionData = useStore((state) => state.setEmotionData);
  const setAttentionData = useStore((state) => state.setAttentionData);
  const isCameraOn = useStore((state) => state.isCameraOn);

  const toggleCamera = async () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      await startCamera();
    }
  };

  const startCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setCameraStatus(true);
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
      setCameraStatus(false);
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

              latestQuizAttentionData = e.detail;

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
                          clearInterval(quizAttentionInterval as NodeJS.Timeout);
                          quizAttentionInterval = null;

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
                }, 10000);
              }
            } else {
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

              latestQuizEmotionData = e.detail;

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
                          clearInterval(quizEmotionInterval as NodeJS.Timeout);
                          quizEmotionInterval = null;

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
                }, 10000);
              }
            } else {
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

    return () => {
      stopCamera();
    };
  }, [stream, isCameraOn, setCameraStatus, setEmotionData, setAttentionData]);

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <button
        onClick={toggleCamera}
        className="relative w-10 h-10 bg-green-600 rounded-full flex items-center justify-center focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        {!isCameraOn && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            className="w-10 h-10 absolute"
          >
            <line x1="4" y1="4" x2="20" y2="20" strokeWidth="2" />
          </svg>
        )}
        {isCameraOn && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
        )}
      </button>
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
    </div>
  );
};

export default QuizWebcamAnalyzer;