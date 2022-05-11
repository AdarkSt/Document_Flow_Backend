const initializeDocument = (document) => {
    const newDocument = {...document}
    switch (document.type) {
        case "dayOffDocument" : 
            newDocument.accepter_1_email  = "sergeybuniatyan@dflow.com"
            newDocument.accepter_2_email = "merisaryan@dflow.com"
            newDocument.accepter_3_email = "manaelinyan@dflow.com"
            newDocument.accepter_1_position  = "Թիմի ղեկավար"
            newDocument.accepter_2_position = "Ծրագրի ղեկավար"
            newDocument.accepter_3_position = "Մարդկային ռեսուրսների ղեկավար"
            newDocument.accepter_1_seen = false
            newDocument.accepter_2_seen = false
            newDocument.accepter_3_seen = false
            newDocument.accepter_1_answer = false
            newDocument.accepter_2_answer = false
            newDocument.accepter_3_answer = false
            newDocument.denied = false
            newDocument.accepted = false
            newDocument.seenStep = 1
            newDocument.accepters = 3
            return newDocument
        case "VacantionDocument" :
            newDocument.accepter_1_email  = "sergeybuniatyan@dflow.com"
            newDocument.accepter_2_email = "merisaryan@dflow.com"
            newDocument.accepter_3_email = "manaelinyan@dflow.com"
            newDocument.accepter_4_email = "annanahapetyan@dflow.com"
            newDocument.accepter_1_position  = "Թիմի ղեկավար"
            newDocument.accepter_2_position = "Ծրագրի ղեկավար"
            newDocument.accepter_3_position = "Մարդկային ռեսուրսների ղեկավար"
            newDocument.accepter_4_position = "Հաշվապահ"
            newDocument.accepter_1_seen = false
            newDocument.accepter_2_seen = false
            newDocument.accepter_3_seen = false
            newDocument.accepter_4_seen = false
            newDocument.accepter_1_answer = false
            newDocument.accepter_2_answer = false
            newDocument.accepter_3_answer = false
            newDocument.accepter_4_answer = false
            newDocument.denied = false
            newDocument.accepted = false
            newDocument.seenStep = 1
            newDocument.accepters = 4
            return newDocument
    }
}

module.exports = initializeDocument