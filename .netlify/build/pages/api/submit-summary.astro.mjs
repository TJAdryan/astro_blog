import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";
import { renderers } from "../../renderers.mjs";
const prerender = false;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
path.join(__dirname, "../../../src/data/article_queue.json");
const POST = async ({ request, redirect }) => {
  const data = await request.formData();
  const summary = data.get("summary");
  data.get("articleId");
  const articleTitle = data.get("articleTitle");
  const articleLink = data.get("articleLink");
  if (!summary || summary.length < 1e3) {
    return new Response("Summary too short", { status: 400 });
  }
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      scopes: ["https://www.googleapis.com/auth/documents", "https://www.googleapis.com/auth/drive"]
    });
    const docs = google.docs({ version: "v1", auth });
    const drive = google.drive({ version: "v3", auth });
    const createResponse = await docs.documents.create({
      requestBody: {
        title: `Summary: ${articleTitle}`
      }
    });
    const documentId = createResponse.data.documentId;
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: `${articleTitle}

Link: ${articleLink}

Summary:
${summary}
`
            }
          }
        ]
      }
    });
    return redirect("/private?success=true");
  } catch (error) {
    console.error("Error saving summary:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
