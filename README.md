## VDB Branch Logs

1. Cannot use `fileUrl` (firebase direct file link) as a parameter of the
   function that called the POST request API function

   - Idea: Passing the file itself to the POST request function

2. JSON cannot pass an entire file. So the goal is to grab the file from the
   client/browser and download locally.

   - Cannot access `fs` or file system to download stuff locally from the
     client-side
   - Idea: Pass the file from the client to the server in a different way than
     local saves (`multer` and `formidable`)

3. Using `multer` to intercept the file from the client side during

   - Multer doesn't directly save files from the browser/client side. Multer
     intercepts a request, parses the incoming form data, and extracts the
     files, saving them to the specified destination folder on the server. Issue
     3: `multer` needs some sort of boundary http headers. Couldn't figure it
     out so...

4. Working: `FormData` that's necessary to work with file uploads via HTTP/JSON.
   Successfully prints.

5. Using `formidable` to save file locally from the server side (api endpoint
   side).

   - Issue 4: Another http header boundary issue.

What to try?

- Fix `formidable`
- Try downloading from the firebase `fileUrl` from the API function (server-side
  b/c not allowed on client-side)

## Firebase Setup

### Within Firebase on the browser

1. Go to team firebase project
2. Go to "Project Overview"
3. Click on the "5 apps" (we have a total of 5 including the `carl_app` android
   and ios, `now_ui_flutter`, etc.)
4. Click on the GEAR ICON to the right of `</> carl_app (web)`
   1. This should navigate to the `General` page.
   2. Scroll all the way down
   3. Under `SDK setup and config`, make sure `npm` is selected
   4. Copy the initialization script

### Within the web app

1. Inside VS Code or terminal run `npm install firebase`
2. Create a `next.config.js` file in the root directory of the project
3. Define all environment variables inside the `next.config.js` to be referenced
   by `firebaseConfig.js`
   1. Environment variables values are provided by Firebase in the settings of
      `carl_app (web)`

### Using Firebase in the code

In JavaScript files, import objects as needed.

Example:

```js
import { app } from '@/firebaseConfig'
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from 'firebase/storage'
import { getDatabase, set } from 'firebase/database'
```

**References:**

- Firebase Documentation
  - Database - https://firebase.google.com/docs/database/web/start
  - Storage bucket - https://firebase.google.com/docs/storage/web/start

---

## Next.js Basics

React with a couple new rules:

When naming folder (at least under /app), need to name it something like
"`_component`" because next.js will treat folder as routers.

JS file start with capital letter like "`Header.js`" for components

### Optional:

Install:

1. `ES7+ React/Redux/React-Native` linter by `dsznajder`
2. Tailwind CSS IntelliSense by Tailwind Labs

Using default template

```
rfce
```

### UI Assets

Swap out styles and assets by going to the official websites for the following
libraries used:

- Tailwind UI based library called **Hyper UI**
- Logoipsum - dummy logos
- Icons - Lucide.dev

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

You can start editing the page by modifying `app/page.js`. The page auto-updates
as you edit the file.

This project uses
[`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to
automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out
[the Next.js GitHub repository](https://github.com/vercel/next.js/) - your
feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our
[Next.js deployment documentation](https://nextjs.org/docs/deployment) for more
details.
