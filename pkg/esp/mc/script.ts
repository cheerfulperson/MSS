import fs from "fs/promises";

function replace(
  fWord: string,
  lWord: string,
  data: string,
  replaceData: string
) {
  const firstIndex = data.indexOf(fWord) + fWord.length;
  const lastIndex = data.indexOf(lWord, firstIndex);
  return `${data.slice(0, firstIndex)}\n  ${replaceData}${data.slice(
    lastIndex
  )}`;
}

async function addBuildToC() {
  const cppFile = "./esp/StaticFiles.cpp";
  const replaceConnectHTML = "//::connectHTML";
  const replaceConnectJS = "//::connectJS";
  const html = (await fs.readFile("./static/index.html", "utf-8")).replace(
    /["]/g,
    '\\"'
  );
  const js = (await fs.readFile("./static/index.js", "utf-8"))
    .replace(
      "/*! For license information please see index.js.LICENSE.txt */\n",
      ""
    )
    .replace(/["]/g, '\\"');
  let cpp = await fs.readFile(cppFile, "utf-8");

  cpp = replace(replaceConnectHTML, "//::end", cpp, `connectHTML = "${html}";\n  `);
  cpp = replace(replaceConnectJS, "//::end", cpp, `connectJS = "${js.slice(0, 40000)}";\n  `);
  await fs.writeFile(cppFile, cpp);
}

addBuildToC().then(() => {
  console.log("Success :)");
});