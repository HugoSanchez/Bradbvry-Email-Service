const getEmailOptions_Join = (to, collectionName, url, secret) => {
    return {
        from: {name: 'Bradbvry', address: 'hugo@bradbvry.com'},
        to: to,
        subject: `You've been invited to ${collectionName}`,
        html: `
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&display=swap" rel="stylesheet">
        <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;">Hey there!</p> 
        <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;">You've been invited to join 
        <span style="font-weight: 600;"> ${collectionName} </span>collection on Bradbvry. Please do so using this link <a href=${url}>here.</a></p>
        <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;">Here's your collection secret: 
        <span style="font-weight: 600;"> ${secret}</span> you will need this to be able to join.</p>
        <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;">Regards :)</p>`
    };
}

const getEmailOptions_Confirm = (to, recepient, collectionName, url) => {
    return {
        from: {name: 'Bradbvry', address: 'hugo@bradbvry.com'},
        to: to,
        subject: `Confirm membership to ${collectionName}`,
        html: `
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&display=swap" rel="stylesheet">
        <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;">Hey there!</p> 
        <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;">${recepient} has joined
        <span style="font-weight: 600;"> ${collectionName} </span>collection on Bradbvry. Please confirm their membership <a href=${url}>here.</a></p>
        <p style="font-family:'Montserrat', sans-serif; font-size: 14px; font-weight: 200;">Regards :)</p>`
    };
}

module.exports = {getEmailOptions_Join, getEmailOptions_Confirm}