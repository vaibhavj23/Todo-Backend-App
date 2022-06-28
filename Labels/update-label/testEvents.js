//to create label
createLabelRequest = {
    url: '{baseUrl}/v1/todoapp/user/{userId}/label/',
    body: {
        "labelName": "Morning ",
        "description": "Morning Activities"

    }
}

//to update label
updateLabelRequest = {
    url: '{baseUrl}/v1/todoapp/user/{userId}/label/{labelId}',
    body: {
        "labelName": "Morning ",
        "description": "Morning Activities 2"

    }
}
