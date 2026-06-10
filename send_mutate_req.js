async function test() {
  const payload = {
    prompt: "Add a hero block with the headline 'New Arrivals' and a badge 'Sale'",
    config: {
      pages: {
        home: {
          blocks: []
        }
      }
    }
  };

  try {
    const response = await fetch("http://localhost:3000/api/ai/mutate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": "convora-access-token=dummy-token"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    console.log("Status Code:", response.status);
    console.log("Response:", text);
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

test();
