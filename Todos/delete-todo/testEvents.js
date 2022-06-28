//to delete single todo
deleteTodoRequest = {
    url: '{baseUrl}/v1/todoapp/user/{userId}/todo/{todoId}',
    method: 'DELETE'
}

//to delete multiple todos of a user
deleteMultipleTodosRequest = {
    url: '{baseUrl}/v1/todoapp/user/{userId}/todo/',
    queryStringParameters: {
        todoIds: "1234,4567" //comma seperated todoIds
    },
    method: 'DELETE'
}

