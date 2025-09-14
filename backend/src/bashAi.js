import { exec } from 'child_process';

export const createEmail = async (id, day, reason, affectedClasses) => {
    const prompt = `Please write a formal leave request email for student ID: ${id}, requesting leave on ${day} due to "${reason}". The following classes will be affected: ${JSON.stringify(affectedClasses)}.`;

    // Escape double quotes in the prompt
    const escapedPrompt = prompt.replace(/"/g, '\\"');

    const command = `curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent" \
  -H 'Content-Type: application/json' \
  -H 'X-goog-api-key: AIzaSyDisaDnSiZsY-IgKjjQtmeIp6oxnT6R_6A' \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "${escapedPrompt} Response without header and without any replacement for user."
          }
        ]
      }
    ]
  }'`;

    /* exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    }); */

    // Returning a Promise that resolves when the exec command completes
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            try {
                resolve(JSON.parse(stdout)); // Attempt to parse the JSON response
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                reject(parseError);
            }
        });
    });
};