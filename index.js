const express = require('express');
const User = require('./model/User')
const mongoose = require('./db/conn')
const bcrypt = require('bcryptjs')
const app = express();

app.use (
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

app.post('/createuser', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body
    console.log(name)
    console.log(email)
    
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)
    console.log(passwordHash)



    if (!name) {
        return res.status (422).json({ error: 'O nome é obrigatório!' })
            }
            
    if (!email) {
        return res.status (422).json({ error: 'O email é obrigatório!' })
            }
    if (!password) {
        return res.status (422).json({ error: 'A senha é obrigatória!' })   
            }
    if (password !== confirmpassword) {
        return res.status (422).json({ error: 'As senhas não coincidem!' })
    }

    const userExiste =  await User.findOne({ name: name })  
if (userExiste) {
    return res.status(422).json({ error: 'Por favor, utilize outro nome!' })
} 
const userExisteEmail =  await User.findOne({ email: email })
if (userExisteEmail) {
    return res.status(422).json({ error: 'Por favor, utilize outro email!' })
}
const userExistePassword =  await User.findOne({ password: password })
if (userExistePassword) {
    return res.status(422).json({ error: 'Por favor, utilize outra senha!' })
}

 const user = new User({
    name,
    email,
    password: passwordHash
 })
  await user.save()
 res.status(201).json({ message: `O usuário ${name} foi criado com sucesso!`})

})

app.get('/', (req, res) => {
    res.status(200).json({ message: 'cadastrar usuário' })
})

app.listen(3000)