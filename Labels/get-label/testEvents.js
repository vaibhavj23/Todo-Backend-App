//to get all labels of a user
getAlllabelsRequest = {
    url: '{baseUrl}/v1/todoapp/user/{userId}/label/',
    method: 'GET'
}

//to get label based on labelId
getLabelRequest = {
    url: '{baseUrl}/v1/todoapp/user/{userId}/label/{labelId}',
    method: 'GET'
}

