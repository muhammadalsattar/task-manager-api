const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);

// mongoose.connect('mongodb+srv://taskapp:sekolana@cluster0.7f3y7.mongodb.net/taskapp?retryWrites=true&w=majority');