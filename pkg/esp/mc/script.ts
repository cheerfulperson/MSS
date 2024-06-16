import fs from "fs/promises";

function replace(fWord: string, lWord: string, data: string, replaceData: string) {
  const firstIndex = data.indexOf(fWord) + fWord.length;
  const lastIndex = data.indexOf(lWord, firstIndex);
  return `${data.slice(0, firstIndex)}\n  ${replaceData}${data.slice(lastIndex)}`;
}

async function addBuildToC() {
  const cppFile = "./esp/StaticFiles.cpp";
  const replaceConnectHTML = "//::connectHTML";
  const replaceConnectJS = "//::connectJS";
  const html = (await fs.readFile("./static/index.html", "utf-8")).replace(/["]/g, '\\"');
  const js = (await fs.readFile("./static/index.js", "utf-8")).replace(/["]/g, '\\"').replace(/\\n/g, "");
  let cpp = await fs.readFile(cppFile, "utf-8");
  let cpp1 = await fs.readFile("./esp_sensors/StaticFiles.cpp", "utf-8");
  let cpp2 = await fs.readFile("./esp_actuators/StaticFiles.cpp", "utf-8");

  cpp = replace(replaceConnectHTML, "//::end", cpp, `const char* connectHTML = "${html}";\n`);
  cpp = replace(replaceConnectJS, "//::end", cpp, `const char* connectJS = "${js}";\n`);
  cpp1 = replace(replaceConnectHTML, "//::end", cpp1, `const char* connectHTML = "${html}";\n`);
  cpp1 = replace(replaceConnectJS, "//::end", cpp1, `const char* connectJS = "${js}";\n`);
  cpp2 = replace(replaceConnectHTML, "//::end", cpp2, `const char* connectHTML = "${html}";\n`);
  cpp2 = replace(replaceConnectJS, "//::end", cpp2, `const char* connectJS = "${js}";\n`);

  await fs.writeFile(cppFile, cpp);
}

addBuildToC().then(() => {
  console.log("Success :)");
});
