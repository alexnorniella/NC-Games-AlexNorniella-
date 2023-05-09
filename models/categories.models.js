const db = require("../db/connection")


exports.selectCategories = () => {
        return db.query(`
    SELECT * FROM categories;
    `).then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 400, message: 'Data not found' })

            }
            return result.rows;
        })
    }

