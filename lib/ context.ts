import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "@/lib/ embeddings"
export const getPineconeClient = () => {
  console.log("Initializing Pinecone client");
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string,
) {
  try {
    console.log("Getting Pinecone client");
    const client = await getPineconeClient();
    console.log("Pinecone client obtained");

    console.log("Accessing Pinecone index: cognozen");
    const pineconeIndex = await client.index("cognozen");

    console.log("Pinecone index accessed");

    console.log("Converting fileKey to ASCII namespace");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    console.log("Namespace created:", convertToAscii(fileKey));

    console.log("Querying namespace with embeddings");

    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    console.log("Query completed, number of matches:", queryResult.matches?.length);

    console.log("Returning matches");
    return queryResult.matches || [];
  } catch (error) {
    console.log("Error querying embeddings:", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  console.log("Getting embeddings for query:", query);
  const queryEmbeddings = await getEmbeddings(query);
  console.log("Embeddings obtained, length:", queryEmbeddings.length);

  console.log("Getting matches from embeddings");
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  console.log("Matches obtained, count:", matches.length);

  // Log all match scores
  matches.forEach((match, index) => {
    console.log(`Match ${index + 1} score:`, match.score);
  });

  console.log("Filtering qualifying documents");
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7, // Lowered threshold to 0.5
  );
  console.log("Documents filtered, qualifying count:", qualifyingDocs.length);

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  console.log("Mapping documents to their text");
  let docs = qualifyingDocs.map((match) => {
    const metadata = match.metadata as Metadata;
    console.log("Document metadata:", metadata);
    return metadata.text;
  });
  console.log("Documents mapped, count:", docs.length);

  // If we still have no docs, use all matches regardless of score
  if (docs.length === 0) {
    console.log("No qualifying docs, using all matches");
    docs = matches.map((match) => {
      const metadata = match.metadata as Metadata;
      console.log("Document metadata:", metadata);
      return metadata.text;
    });
    console.log("All documents mapped, count:", docs.length);
  }

  console.log("Joining document texts and returning result");
  const result = docs.join("\n").substring(0, 3000);
  console.log("Final context length:", result.length);

  return result;
}