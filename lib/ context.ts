import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "@/lib/ embeddings";

export const getPineconeClient = () => {
  console.log("Initializing Pinecone client");
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    console.log("Getting Pinecone client");
    const client = await getPineconeClient();
    console.log("Pinecone client obtained");

    console.log("Accessing Pinecone index: chatpdf");
    const pineconeIndex = await client.index("cognozen");
  
    console.log("Pinecone index accessed");

    console.log("Converting fileKey to ASCII namespace");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    console.log("Namespace created");

    console.log("Querying namespace with embeddings");

    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    console.log("Query completed");

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
  console.log("Embeddings obtained");

  console.log("Getting matches from embeddings");
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  console.log("Matches obtained");

  console.log("Filtering qualifying documents");
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );
  console.log("Documents filtered");

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  console.log("Mapping documents to their text");
  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  console.log("Documents mapped");

  console.log("Joining document texts and returning result");
  return docs.join("\n").substring(0, 3000);
}
