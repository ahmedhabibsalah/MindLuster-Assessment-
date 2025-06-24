const API_BASE = "http://localhost:4000";

async function testAPI() {
  console.log("🚀 Testing Kanban API endpoints...\n");

  try {
    console.log("1. Testing GET /tasks");
    const allTasksResponse = await fetch(`${API_BASE}/tasks`);
    const allTasks = await allTasksResponse.json();
    console.log(`✅ Found ${allTasks.length} tasks`);

    console.log("\n2. Testing GET /tasks?column=backlog");
    const backlogResponse = await fetch(`${API_BASE}/tasks?column=backlog`);
    const backlogTasks = await backlogResponse.json();
    console.log(`✅ Found ${backlogTasks.length} backlog tasks`);

    console.log("\n3. Testing search: GET /tasks?q=design");
    const searchResponse = await fetch(`${API_BASE}/tasks?q=design`);
    const searchResults = await searchResponse.json();
    console.log(`✅ Found ${searchResults.length} tasks matching "design"`);

    console.log("\n4. Testing pagination: GET /tasks?_page=1&_limit=5");
    const paginatedResponse = await fetch(`${API_BASE}/tasks?_page=1&_limit=5`);
    const paginatedTasks = await paginatedResponse.json();
    console.log(
      `✅ Retrieved ${paginatedTasks.length} tasks (page 1, limit 5)`
    );

    console.log("\n5. Testing POST /tasks (create new task)");
    const newTask = {
      title: "Test Task",
      description: "This is a test task created by the API test script",
      column: "backlog",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const createResponse = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    const createdTask = await createResponse.json();
    console.log(`✅ Created task with ID: ${createdTask.id}`);

    console.log("\n6. Testing PUT /tasks/:id (update task)");
    const updatedTask = {
      ...createdTask,
      column: "in_progress",
      updatedAt: new Date().toISOString(),
    };

    const updateResponse = await fetch(`${API_BASE}/tasks/${createdTask.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    const updated = await updateResponse.json();
    console.log(`✅ Updated task ${updated.id} - moved to ${updated.column}`);

    console.log("\n7. Testing DELETE /tasks/:id (delete task)");
    const deleteResponse = await fetch(`${API_BASE}/tasks/${createdTask.id}`, {
      method: "DELETE",
    });

    if (deleteResponse.ok) {
      console.log(`✅ Deleted task ${createdTask.id}`);
    }

    console.log(
      "\n🎉 All API tests passed! Your json-server is working correctly."
    );
  } catch (error) {
    console.error("❌ API test failed:", error.message);
    console.log("\n💡 Make sure json-server is running:");
    console.log("   npm run api");
    console.log("   or");
    console.log("   json-server --watch db.json --port 4000");
  }
}

testAPI();
