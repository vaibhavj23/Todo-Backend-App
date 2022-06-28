//to create todo
createTodoRequest = {
    url: '{baseUrl}/v1/todoapp/user/{userId}/todo/',
    body: {
        "todoName": "Gym 1",
        "description": "Go to Gym",
        "reminder": "2022-01-15T16:17:30.814Z" //optional field to add reminder
    },
    method: 'POST'
}

//to update todo
updateTodoRequest = {
    url: '{baseUrl}/v1/todoapp/user/{userId}/todo/{todoId}',
    body: {
        "todoName": "Gym",
        "description": "Go to Gym",
        "reminder": "2022-01-15T16:17:30.814Z", //optional field to update reminder 
        "isArchived": true //to archive todo pass isArchived as true
    },
    method: 'POST'
}

//to add or remove labels to todo
addOrRemoveLabelsFromTodo = {
    url: '{baseUrl}/v1/todoapp/user/{userId}/todo/{todoId}',
    queryStringParameters: {
        addLabels: "12345,45677", //comma seperated label ids
        removeLabels: "12345,45677" //comma seperated label ids
    },
    method: 'POST'
}

// delete reminder from a todo
deleteReminderFromTodo = {
    url: '{baseUrl}/v1/todoapp/user/{userId}/todo/{todoId}',
    queryStringParameters: {
        deleteReminder: true //pass deleteReminder as true
    },
    method: 'POST'
}