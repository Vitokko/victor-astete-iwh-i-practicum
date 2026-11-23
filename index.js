require('dotenv').config();

const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const OBJECT_TYPE_ID = process.env.HUBSPOT_OBJECT_TYPE_ID;
const PORT = process.env.PORT || 3002;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// ROUTE 1: GET homepage - read our custom book records.
app.get('/', async (req, res) => {
    if (!HUBSPOT_ACCESS_TOKEN || !OBJECT_TYPE_ID) {
        return res.status(500).send('Configure HUBSPOT_ACCESS_TOKEN and HUBSPOT_OBJECT_TYPE_ID in .env.');
    }

    try {
        const response = await axios.get(
            `https://api.hubapi.com/crm/v3/objects/${encodeURIComponent(OBJECT_TYPE_ID)}`,
            {
                headers: { Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}` },
                params: { limit: 100, properties: 'name,author,genre' },
                timeout: 10000
            }
        );

        return res.render('homepage', {
            title: 'Book Library | Integrating With HubSpot I Practicum',
            books: response.data.results
        });
    } catch (error) {
        const status = error.response?.status || 502;
        console.error('HubSpot GET books:', status, error.response?.data?.message || error.message);
        return res.status(status).send(`Unable to load books from HubSpot (HTTP ${status}).`);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(PORT, () => console.log(`Practicum running at http://localhost:${PORT}`));