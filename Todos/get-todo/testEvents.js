//to get all todos of a user
getAllTodoRequest = {
    url: '{baseUrl}/v1/todoapp/user/{userId}/todo/',
    method: 'GET'
}

//to get todo based on todoId
getTodoRequest = {
    url: '{baseUrl}/v1/todoapp/user/{userId}/todo/{todoId}',
    method: 'GET'
}

