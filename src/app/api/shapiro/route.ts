import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { writeFileSync, unlinkSync } from "fs";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  const tempInputPath = path.join(process.cwd(), "public", "temp_input.json");
  const pythonScriptPath = path.join(
    process.cwd(),
    "public",
    "scripts",
    "shapiroWilkTest.py"
  );

  try {
    const { data } = await req.json();

    // Write data to temp file
    writeFileSync(tempInputPath, JSON.stringify(data));

    // Execute Python script
    //This runs a shell command like: python public/scripts/shapiroWilkTest.py < public/temp_input.json
    //The file content of temp_input.json is piped into the Python script’s stdin.
    //This matches the Python line: data = json.load(sys.stdin)
    const command = `python "${pythonScriptPath}" < "${tempInputPath}"`;
    const { stdout, stderr } = await execAsync(command);

    if (stderr) throw new Error(stderr);

    // Parse and return results
    const result = JSON.parse(stdout);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Shapiro-Wilk test failed",
        details: error,
      }),
      { status: 500 }
    );
  } finally {
    // Clean up temp file (deletes it)
    try {
      unlinkSync(tempInputPath);
    } catch (e) {
      console.log(e);
    }
  }
}
