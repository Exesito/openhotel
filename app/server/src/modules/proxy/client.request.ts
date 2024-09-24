import { getContentType } from "shared/utils/main.ts";
import { Server } from "modules/server/main.ts";

export const requestClient = async (request: Request) => {
  const ROOT_DIR_PATH = "/";

  try {
    const { url } = request;
    const { pathname } = new URL(url);

    if (!pathname.startsWith(ROOT_DIR_PATH)) {
      return new Response("404", { status: 404 });
    }
    if (pathname.startsWith("/data")) {
      try {
        //removes "/data"
        const targetPathname = pathname.substring(5);
        const fileData = await Deno.readFile(
          "./assets/furniture/.data" + targetPathname,
        );

        return new Response(fileData, {
          headers: {
            "Content-Type": getContentType(targetPathname),
          },
        });
      } catch (e) {}
      return new Response("404", { status: 404 });
    }

    const filePath = pathname.replace("/", "");
    const targetFile = "./client/" + (filePath || "index.html");

    let fileData = await Deno.readFile(targetFile);
    if (targetFile === "./client/index.html")
      fileData = (await Deno.readTextFile(targetFile)).replace(
        /{\s*\/\*__CONFIG__\*\/\s*}/,
        JSON.stringify(Server.getConfig()),
      );
    return new Response(fileData, {
      headers: {
        "Content-Type": getContentType(targetFile),
      },
    });
  } catch (e) {}
};