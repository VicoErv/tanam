import * as dust from 'dustjs-helpers';
import * as site from './site';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as fs from 'fs';
import * as content from './content';

// ----------------------------------------------------------------------------
// DUST HELPERS
// Implements Tanam helper extensions for the template engine
//
dust.helpers.document = (chunk, context, bodies, params) => content.getDocumentByPath(params.path);
dust.helpers.documents = (chunk, context, bodies, params) =>
  content.getDocumentsInCollection(
    params.collection,
    params.orderBy || 'publishTime',
    params.sortOrder || 'desc',
    parseInt(params.limit) || 10);


/**
 * This method is same as the template helper method `document` that allows web developer to fetch
 * an arbitrary (published) document by its id. This can be used to create javascript pop-ups with
 * document content, etc.
 */
export const tanamDocument = functions.https.onCall((data, context) => {
  console.log(`[tanamDocument] data=${JSON.stringify(data)}`);
  return content.getDocumentByPath(data.path);
});

/**
 * This method is same as the template helper method `documents` that allows web developer to fetch
 * arbitrary (published) documents based on critera. It is an API for making client side pagination
 * to expand list results etc.
 */
export const tanamDocuments = functions.https.onCall((data, context) => {
  console.log(`[tanamDocuments] data=${JSON.stringify(data)}`);
  return content.getDocumentsInCollection(
    data.collection,
    data.orderBy || 'publishTime',
    data.sortOrder || 'desc',
    parseInt(data.limit) || 10);
});

/**
 * Renders a HTML page from a given Firestore document that contains Tanam content data.
 *
 * @param document Firestore content document
 */
export async function renderDocument(document: admin.firestore.DocumentSnapshot) {
  const contentDocument = new content.DocumentContext(document);
  const theme = await site.getThemeName();
  const templateFiles = await content.getTemplateFiles(theme);

  for (const file of templateFiles) {
    const [fileContent] = await file.download();
    const bytesOfData = (fileContent.byteLength / 1024).toFixed(2);
    console.log(`[renderDocument] Downloaded template: ${file.name} (${bytesOfData} kB)`);

    const templateName = file.name.substring(file.name.lastIndexOf('/') + 1, file.name.lastIndexOf('.dust'));
    console.log(`[renderDocument] Compiling template: ${templateName}`);
    const source = dust.compile(fileContent.toString('utf8'), templateName);
    dust.register(templateName, dust.loadSource(source));
  }

  const template = contentDocument.template;
  const context = await content.PageContext.createForDocument(contentDocument);

  return new Promise<string>((resolve, reject) => {
    dust.render(template, context, (err: any, out: string) => {
      if (err) {
        console.log(`[renderDocument] Error rendering: ${JSON.stringify(err)}`);
        reject(JSON.stringify(err));
      } else {
        console.log(`[renderDocument] Finished rendering`);
        resolve(out);
      }
    });
  });
}


export function renderAdminPage(indexFileName: string, firebaseConfig: any) {

  const indexFile = fs.readFileSync(indexFileName, 'utf8');
  return new Promise((resolve, reject) => {
    dust.renderSource(indexFile, { fbConfig: firebaseConfig }, (err, out) => {
      if (err) {
        console.log(`Error rendering: ${JSON.stringify(err)}`);
        reject(err);
        return;
      }

      console.log(`[Finished rendering`);
      resolve(out);
    });
  });
}
