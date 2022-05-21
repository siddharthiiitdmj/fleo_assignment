//including libraries
const express = require("express");

const App = express();

App.use(express.json());

//database connection (I didnt use mongodb to keep the task simple)
let database = require("./database/database");

// Route    - /newCategory
// Des      - To add a category
// Access   - Public
// Method   - POST
// Params   - none
// Body     - present
App.post("/newCategory", (req, res) => {
    try {
        const { id, categoryName, curSales, targetSales, parentID, level } = req.body.credentials;
        if(!parentID){
            parentID = "null";
        }
        //check if category exists already
        let flag = false;
        database.Categories.forEach((category) => {
            if(category.categoryID === id)
            {
                throw new Error("Category already exists");
            }
            if(category.categoryID === parentID)
            {
                flag = true;
            }
        });
        if(!flag)
        {
            throw new Error("Invalid parent ID");
        }

        const percent = Math.round(
            (curSales / targetSales) * 100
        );
        const col = "";
        const label = "";
        if (percent <= 33) {
            col = "red";
            label = "At risk";
        } else if (percent > 66) {
            col = "green";
            label = "on track";
        } else {
            col = "yellow";
            label = "off track";
        }

        //create category
        const category = {
            categoryID: id,
            name: categoryName,
            totalTargetSales: targetSales,
            currentSales: curSales,
            level: level,
            progressPercentage: percent,
            colorCode: col,
            label: label,
            parentID: parentID,
            childID: [],
        };

        //add category
        database.categories.push(category);

        //updating parent category
        for(const category of database.categories) {
            if(category.categoryID === parentID){
                category.childID.push(id);
                break;
            }
        };

        return res.json({ message: "Category added successfully", category: category });
    } catch (e) {
        return res.json({ error: e.message });
    }
});

// Route    - /updateCategory
// Des      - To update a category
// Access   - Public
// Method   - PUT
// Params   - none
// Body     - present
App.put("/updateCategory", (req, res) => {
    try {
        const { id, curSales, targetSales } = req.body;
        const percent = Math.round(
            (curSales / targetSales) * 100
        );
        let col = "";
        let label = "";
        if (percent <= 33) {
            col = "red";
            label = "At risk";
        } else if (percent > 66) {
            col = "green";
            label = "on track";
        } else {
            col = "yellow";
            label = "off track";
        }

        let flag = false;
        let cat = {};
        //updating all details of the category
        for(let category of database.Categories) {
            if(category.categoryID === id){
                category.currentSales = curSales;
                category.totalTargetSales = targetSales;
                category.progressPercentage = percent;
                category.colorCode = col;
                category.label = label;
                cat = category;
                flag = true;
                break;
            }
        };

        //checking if the category doesn't exist
        if(!flag)
        {
            throw new Error(`Category with id: ${id} does not exist`);
        }

        return res.json({ message: "Category updated successfully", cat });
    } catch (e) {
        return res.json({ error: e.message });
    }
});

// Route    - /getCategory/:id
// Des      - To get a particular category
// Access   - Public
// Method   - GET
// Params   - id
// Body     - none
App.get("/getCategory/:id", (req, res) => {
    const id = req.params.id;
    for(const category of database.Categories) {
        const catID = category.categoryID;
        if(catID === id)
        {
            return res.json({category});
        }
    }
    return res.json({ error: `No category with id: ${id} exists` });
});

// Route    - /getParentCategory/:id
// Des      - To get a particular category
// Access   - Public
// Method   - GET
// Params   - id
// Body     - none
App.get("/getParentCategory/:id", (req, res) => {
    const id = req.params.id;
    database.Categories.forEach((category) => {
        if(category.categoryID === id)
        {
            if(category.parentID === "null")
            return res.json({ parent: `the category with id: ${id} has no parent` });

            database.Categories.forEach((cat) => {
                if(cat.categoryID === category.parentID){
                    return res.json({ parent: cat });
                }
            });
        }
    });
    return res.json({ error: `No category with id: ${id} exists` });
});

// Route    - /deleteCategory/:id/:deleteChild
// Des      - To get a particular category
// Access   - Public
// Method   - DELETE
// Params   - id, deleteChild
// Body     - none
App.delete("/deleteCategory/:id/:deleteChild", (req, res) => {
    const id = req.params.id;
    const deleteChild = req.params.deleteChild;

    const children = [];

    //removing the category if present
    database.Categories = database.Categories.filter( (category) => {
        if(category.categoryID !== id)
        {
            return category;
        }
        else{
            children = category.childID;
            for (const cat of database.Categories) {
                if(cat.categoryID === category.parentID){
                    cat.childID = cat.childID.filter((child) => child !== id);
                    break;
                }
            };

            //removing child if specified
            if(deleteChild){
                database.Categories = database.Categories.filter( (category) => {
                    let flag = false;
                    const childID = children.forEach((child) => {
                        if(child === category.categoryID)
                        {
                            flag = true;
                            return child;
                        }
                    })
                    if(!flag)
                    {
                        return category;
                    }
                    else{
                        for (const cat of database.Categories) {
                            if(cat.categoryID === childID){
                                cat.parentID = "null";
                                break;
                            }
                        }
                    }
                });
            }

            category.childID = [];
        }
    });
    return res.json({ message: "Category deleted" });

});


App.listen(4000, () => console.log("Test Run"));