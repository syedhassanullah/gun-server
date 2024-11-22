const mongoose = require('mongoose')
require('dotenv').config();

//Schema Section-----------------------
const contactd = require('./BDSRC/MODEL/Contact');
const productd = require('./BDSRC/MODEL/Product');
const User = require('./BDSRC/MODEL/User');
const ProductOrder = require('./BDSRC/MODEL/OrderDetails')

//DATABASE Connection------------------
const dbconnection = require('./BDSRC/DATABASE/DB');

const jwt = require("jsonwebtoken");

const bcrypt = require('bcryptjs');

const port =process.env.PORT || 8085;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const path = require('path')
app.use(cors({ origin: "http://localhost:8095"||"guns-holster.com"||"https://sitegun.netlify.app"}));
app.use(bodyParser.json());


dbconnection.on('connected', () => {
    console.log('now is connected finaly')
})




////////////-----------------------






//API ------------------------------------------------------------
app.get('/', (req, res) => {
    res.send('Hello World!');
});



//contact api------
app.post('/api/contact1', async (req, res) => {
    try {
        const { fname, lname, contact, message } = req.body;
        res.send('Hello World!');
        const newContact = new contactd({ fname, lname, contact, message, }); // Use the correct model name
        await newContact.save();
        res.status(201).json({ message: 'Data Send Successfully', data: newContact });
        console.log(newContact)
    } catch (err) {
        res.status(500).json({ message: 'Error saving data', error: err });
    }
});


app.get('/api/contact1', async (req, res) => {
    try {
        const contacts = await contactd.find();
        // console.log(contacts);

        res.status(200).json({ message: 'Data retrieved successfully', data: contacts });

    } catch (err) {
        res.status(500).json({ message: 'Error saving data', error: err });
    }
})
// Set up multer for local Storage--------------------------------
const multer = require('multer')
// const upload = multer ({ dest: 'uploads/'});
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, uniqueSuffix + file.originalname)
    }
})
const upload = multer({ storage: storage })


//Product api--------
app.post('/api/product', upload.single('image'), async (req, res) => {
    console.log(req.file)
    console.log('Received body:', req.body);
    res.send("uploaded")
    const { productId, productTitle, description, price } = await req.body;
    const pimage = req.file.filename;
    try {
        const newpdata = new productd({ image: pimage, productId, productTitle, description, price })
        await newpdata.save();
    } catch (error) {
        console.error("Error saving the DATA:", error);
        res.status(500).send("Server Error");
    }
}
);

app.get('/api/product', async (req, res) => {
    try {
        const products = await productd.find();
        res.status(200).json({ message: 'Data recived success fully ', data: products })
    } catch (err) {
        res.status(500).json({ message: 'Error saving data', error: err });
    }
})

// order API--------------

app.post('/api/order', async (req, res) => {
    try {
        const { productId, productTitle, price, productImage, fullname, number, address, landmark } = req.body;
        const newOrder = new ProductOrder({
            productId,
            productTitle,
            price,
            productImage,
            fullname,
            number,
            address,
            landmark,
        })

        await newOrder.save()
        res.status(201).json({ message: 'Data Send Successfully', data: newOrder });
    } catch(err) {
        res.status(400).json({ message: 'Error creating order', error:err });
    }

})

app.get('/api/order', async (req,res) =>{
    try {
        const orderdata = await ProductOrder.find();
        res.status(200).json({ message: 'Data recived success fully ', data:orderdata })
    } catch (err) {
        res.status(500).json({ message: 'Error saving data', error: err });
    }
})

//USERAPI---------------------------------

app.post("/api/register", async (req, res) => {

    const { email, password } = req.body;
    // const uname = 'hassan'
    // const password = 'hassan123'

    if (!email || !password) {
        return res.status(422).send({
            message: "field is required"
        });
    }

    try {
        const userExist = await User.findOne({ email: email });


        if (userExist) {
            return res.status(422).send({
                error: "user is already exist"
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const result = new User({
            email: email,
            password: hash,

        });
        // bycipt password here from schema 
        const userregister = await result.save();

        if (userregister) {
            res.send({
                status: 200,
                message: "signup successfully",
            });
        }

    } catch (error) {
        console.log(error)
    }


    // let User = new UserSchema(req.body)
    // let result = await User.save();
    // res.send(result) ;
});

app.post("/api/update-password", async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
        return res.status(422).send({
            message: "Email, current password, and new password are required"
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        // Compare the current password with the hashed password in the database
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).send({
                message: "Current password is incorrect"
            });
        }

        // Hash the new password before saving
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password with the hashed new password
        user.password = hashedNewPassword;
        await user.save();

        res.send({
            status: 200,
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Server error"
        });
    }
});


app.post("/api/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).send({
            message: "Email and password are required"
        });
    }

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).send({
                message: "Invalid credentials"
            });
        }

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({
                message: "Invalid credentials"
            });
        }

        if (isMatch) {
            let token = jwt.sign(
                {
                    email: user.email,
                    password: isMatch.password
                },
                process.env.SECRET_TOKEN,
                {
                    expiresIn: "1m",
                }
            );
            console.log('TOKEN', token)

            res.send({
                status: 200,
                message: "Login successful",
                user: {
                    email: user.email,
                    UserId: user._id,

                },
                token: token

            });
        }

        // If login is successful, you can send a success response

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Server error"
        });
    }
});




app.listen(port, () => {
    console.log(`server is run port  ${port}`)
});

module.exports = app;








// const mongoose = require('mongoose');
// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');

// const port = 5000;
// const app = express();

// // Middleware
// app.use(bodyParser.json());

// // Database connection
// const dbUri = process.env.uri; // Use a meaningful name for the environment variable
// mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected successfully'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // Schema
// const contactSchema = new mongoose.Schema({
//     name: String,
//     fname: String,
// });

// const Contact = mongoose.model('Contact', contactSchema); // Make sure the model name is 'Contact'

// // API Endpoints
// app.get('/', (req, res) => {
//     res.send('Hello!');
// });

// app.post('/contact', async (req, res) => {
//     try {
//         const { name, fname } = req.body;
//         const newContact = new Contact({ name, fname }); // Use the correct model name
//         await newContact.save();
//         res.status(201).json({ message: 'Data saved successfully', data: newContact });
//     } catch (err) {
//         res.status(500).json({ message: 'Error saving data', error: err });
//     }
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`); // Corrected log message
// });

// module.exports = app;








// //SQL Connection
// const express = require('express');
// const sql = require('mssql');
// const app = express();
// const port = 3001;
// const bodyParser = require('body-parser');
// const cors = require('cors');

// app.use(cors({ origin: "http://localhost:3000" }));
// app.use(bodyParser.json());

// const config = {
//   user: 'sa',
//   password: 'nedo',
//   server: '192.168.0.218',
//   database: 'hassan_db',
//   options: {
//     encrypt: true,
//     trustServerCertificate: true
//   }
// };

// app.get('/', (req, res) => {
//   res.send('respond with a resource');
// });

// app.get('/TEST', (req, res) => {
//   res.send('respond with a TSST');
// });

// app.post('/contact1', (req, res) => {

// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}/`);
// });
