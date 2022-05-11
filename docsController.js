const Docs = require("./models/Docs")
const dotenv = require("dotenv")
var CryptoJS = require("crypto-js");
const initializeDocument = require("./service/initializeDocument")
const NANO = require("nanoid");
const SenderDocs = require("./models/SenderDocs");

dotenv.config()

class DocsController {
    async createDoc(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        try{
            const document = req.body 
            console.log('req.body', req.body)
            const initedDoc = initializeDocument(document)
            console.log('initedDoc', initedDoc)
            const strdoc = JSON.stringify(initedDoc)
            
            const encrypted = CryptoJS.TripleDES.encrypt(strdoc, process.env.FILE_ENCODE_KEY)
            const decrypted = CryptoJS.TripleDES.decrypt(encrypted.toString(), process.env.FILE_ENCODE_KEY).toString(CryptoJS.enc.Utf8)
            console.log('decrypted', decrypted)
            const idInDbs = NANO.nanoid(10)
            const encryptedDoc = {
                id: idInDbs,
                email: initedDoc.accepter_1_email,
                data: encrypted.toString()
            }
            const encryptedSenderDoc = {
                id: idInDbs,
                sender_email: initedDoc.sender_email,
                data: encrypted.toString()
            }
            const docs = await Docs.create(encryptedDoc)
            const senderDocs = await SenderDocs.create(encryptedSenderDoc)

            return res.status(300)
        } catch (error) {
            console.log('error', error)
            return res.status(403).json({message: "something went wrong"})
        }
    }   

    async getResavedDocs(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        try{
            const {email} = req.body
            const docs = await Docs.find({email: email})
            const decryptedDocs = []
            for (const doc of docs) {
                const decrypted = CryptoJS.TripleDES.decrypt(doc.data, process.env.FILE_ENCODE_KEY).toString(CryptoJS.enc.Utf8)
                
                decryptedDocs.push(JSON.parse(decrypted))
            }
            
            return res.status(200).json(decryptedDocs)
        } catch (error) {
            console.log('error', error)
            return res.status(403).json({message: "something went wrong"})
        }
    }

    async getSendedDocs(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        try{
            const {sender_email} = req.body
            const docs = await SenderDocs.find({sender_email: sender_email})
            const decryptedDocs = []
            for (const doc of docs) {
                const decrypted = CryptoJS.TripleDES.decrypt(doc.data, process.env.FILE_ENCODE_KEY).toString(CryptoJS.enc.Utf8)
                
                decryptedDocs.push(JSON.parse(decrypted))
            }
            return res.status(200).json(decryptedDocs)
        } catch (error) {
            console.log('error', error)
            return res.status(403).json({message: "something went wrong"})
        }
    }

    async updateDoc(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        try{
            const doc = JSON.parse(req.body.doc)
            const email = req.body.email
            const dbDocs = await Docs.find({email: email})
            
            const decryptedDocs = []
            for (const dbDoc of dbDocs) {
                const decrypted = CryptoJS.TripleDES.decrypt(dbDoc.data, process.env.FILE_ENCODE_KEY).toString(CryptoJS.enc.Utf8)
                decryptedDocs.push(JSON.parse(decrypted))
            }

            const findedDocIndex = decryptedDocs.findIndex((dbDoc) => dbDoc.sender_id === doc.sender_id)
            const findedDocNonDecrypted = dbDocs[findedDocIndex]

            if(findedDocNonDecrypted) {
                const accepter_email = `accepter_${doc.seenStep}_email`;
                const data = CryptoJS.TripleDES.encrypt(JSON.stringify(doc), process.env.FILE_ENCODE_KEY).toString()
                if (!doc.denied) {
                    if (!doc[accepter_email]) { 
                        console.log('document accepted')
                        const prev_accepter_answer = `accepter_${doc.seenStep-1}_answer`
                        const prev_accepter_seen = `accepter_${doc.seenStep-1}_seen`
                        if(doc[prev_accepter_seen]) {
                            if(prev_accepter_answer) {
                                doc.accepted = true
                                doc.step = 3
                            }
                        }
                        const removed = await Docs.findOneAndRemove({id: findedDocNonDecrypted.id})
                    }
                    else {
                        console.log("changed accepter")
                        const updatedDoc = await Docs.findOneAndReplace({id: findedDocNonDecrypted.id}, {
                            id: findedDocNonDecrypted.id,
                            email: doc[accepter_email],
                            data: data
                        })
                    }
                } else {
                    console.log("document denied")
                    const removed = await Docs.findOneAndRemove({id: findedDocNonDecrypted.id})
                }
                const updatedSenderDoc = await SenderDocs.findOneAndReplace({id: findedDocNonDecrypted.id}, {
                    id: findedDocNonDecrypted.id,
                    sender_email: doc.sender_email,
                    data: data
                })
            } else {
                throw new Error("document didn't find")
            }
            return res.status(200).json(decryptedDocs)
        } catch (error) {
            console.log('error', error)
            return res.status(403).json({message: error.message || "something went wrong"})
        }
    }
}
module.exports = new DocsController()