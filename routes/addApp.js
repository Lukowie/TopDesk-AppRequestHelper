/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
var router = express.Router();
var {init, uploadBlob} = require('../azureHandler.js');
var {pushAppObject} = require('../formHandler.js');
var {Client} = require('@microsoft/microsoft-graph-client');
//var {SPO} = require('../spHandler.js');

let Applist = {};

router.get('/', (req, res, next) => {
    try {
      //SPO();
  test(req);
    res.render('addApp', {
        title: 'AMDSB Application Approvals',
        inApp: true,
        isAuthenticated: req.session.isAuthenticated,
        name: req.session.account?.name,
        applist: Applist.rows,
        });
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function test(req){
  try{
  const graphClient = Client.init({
    authProvider: (done) => {
      done(null, req.session.accessToken);
    }
  });

  //const channels = await graphClient.api('/teams/854fbd34-2554-4da6-8974-9aff2a09eaf0/channels')
  const channels = await graphClient.api('/me/joinedTeams')
  //.expand('channels')
  .get();

  console.log(channels);
}catch(err) {
  console.error(err);
}
}

// inital load of applist data
async function loadAppList(){
    try{
      Applist = await init();
      return Applist;
    } catch (error){
      console.error(error);
    }
  
  }

router.post('/load-list', async (req, res)=> {
    Applist = await loadAppList();
    res.send('Loaded Applist');
})

router.post('/submit-form', (req, res)=> {
    const formData = req.body;
  // check if Applist is populated, if it is, push formData to Applist
  if (Object.keys(Applist).length > 0) {
    if (formData.appName == '' || formData.appLink == '' || formData.desc == '' || formData.VASPLink == '') {
      res.send("Empty values, please input the values");
    } else {

      if (formData.status != "Option" && formData.VASPReport != "Default") {
        Applist.rows.unshift(pushAppObject(formData));
        console.log(Applist.rows[Applist.rows.length-1])
        res.render('addApp', {
            title: 'AMDSB Application Approvals',
            inApp: true,
            isAuthenticated: req.session.isAuthenticated,
            name: req.session.account?.name,
            applist: Applist.rows,
            });
      } else {
        if (formData.status == "Option") {
         res.send("Choose a Status other than default");
        }
        if (formData.VASPReport == "Default") {
          res.send("Choose a VASPReport Option other than default");
        }
      }
    }
  }
})

router.post('/update-azure', async (req, res) => {
    //preventative measure so that file doesn't get erased
    if (Object.keys(Applist).length > 0){
    try {
      await uploadBlob(Applist);
      res.send('/post-action?uploadSuccess')
    } catch (error){
      console.error(error);
      res.send('/post-action?uploadError')
    }
  }else {
    res.send("Please reload page, Applist is not updated yet.");
  }
  })
  
  router.get('/post-action', (req, res) => {
    res.render('addApp', {
        title: 'AMDSB Application Approvals',
        inApp: true,
        isAuthenticated: req.session.isAuthenticated,
        name: req.session.account?.name,
        applist: Applist.rows,
        });
  })
  
  router.post('/delete-app', (req, res) =>{
    const buttonId = req.body.id;
    Applist.rows.splice(buttonId, 1);
    console.log(Applist.rows.length);
    
    res.render('addApp', {
        title: 'AMDSB Application Approvals',
        inApp: true,
        isAuthenticated: req.session.isAuthenticated,
        name: req.session.account?.name,
        applist: Applist.rows,
        });
  })

module.exports = router;
