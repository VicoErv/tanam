import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as path from 'path';
import * as handlers from './handlers';

export interface TanamConfig {
  adminUrl?: string;
  firebaseConfig?: any;
}

const tanamDefaultAppConfig: TanamConfig = {
  adminUrl: 'admin'
};

const app = express();
app.enable('strict routing'); // Redirect to trailing slash
export const tanam = functions.https.onRequest(app);
export function initializeApp(tanamConfig: TanamConfig = {}) {
  const adminClientDir = path.join(__dirname, 'admin_client');
  const appConfig = { ...tanamDefaultAppConfig, ...(tanamConfig || {}) };

  if (admin.apps.length === 0) {
    admin.initializeApp();
  }

  admin.firestore().settings({ timestampsInSnapshots: true });

  app.use(
    `/${appConfig.adminUrl}/public`,
    express.static(path.join(adminClientDir, 'public'))
  );
  app.all(
    `/${appConfig.adminUrl}`,
    (req: express.Request, res: express.Response) => {
      res.redirect('/admin/');
    }
  );
  app.use(
    `/${appConfig.adminUrl}/**`,
    (req: express.Request, res: express.Response) => {
      handlers.handleAdminPage(res, adminClientDir, tanamConfig.firebaseConfig);
    }
  );
  app.use(
    `/adminnew/public`,
    express.static(path.join(__dirname, 'admin/public'))
  );
  app.get('/adminnew', (req: express.Request, res: express.Response) =>
    handlers.handleAdminPage(
      res,
      path.join(__dirname, 'admin'),
      tanamConfig.firebaseConfig
    )
  );
  app.get('/manifest.json', handlers.handlePublicDirectoryFileReq);
  app.get('/robots.txt', handlers.handlePublicDirectoryFileReq);
  app.get('/sitemap.xml', handlers.handleSitemapReq);
  app.get('**', handlers.handleRequest);
}
