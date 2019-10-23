var pendingSchema = require('../schemas/data_pendings_schema.js');
var roundSchema = require('../schemas/data_merry_go_rounds_schema.js');

const shortCodeB2C = '771700';
const mpesaSDK = require('mpesa-node-sdk');

const initiator = 'pluspay';
const secretCredential = 'J/lZJrGJmygZ5GBeCPjHRBCHmnNELvYeaTU6NwrAVa+I58K3/g+edPFRaTkQey0pkgA6b1TTvREC72Be0oEdwwamNbd1EsC6N9pEvXNv4z3whrqPp8CqmTuSnE7vqZHl85QNJML1rzt4irmTwSDxLCt2sH9se4SVJbzFCJDoEj9y6HEA1jUOIHLuR9qyQ/MH5czLj1dYRxkGNAcf7b9Mvdti86pULuNO1IUF8zOCPFzWjtsUDmxtYKGaF24XBrtVBV7z4LNepJTGWt11oneUALqN6XYrozUq5MK+7H0KauhGqwYiLe8us3QFdLpfha35GH3xnLveQAhFBW0MlO58+Q==';

module.exports.approvePendingTransaction = async function (req, res) {
    try {
        var doc = await pendingSchema.findOne({_id: req.body.id});
        switch (req.body.role) {
            case 'Chairperson': {
                doc.chairperson_approved = true;
                break;
            }
            case 'Secretary': {
                doc.secretary_approved = true;
                break;
            }
            case 'Treasure': {
                doc.treasure_approved = true;
                break;
            }
            default:
                break;
        }

        var contribution_cycle_days = 7;
        switch(doc.duration) {
          case '1 week':
            contribution_cycle_days = 7;
            break;
          case '2 weeks': 
            contribution_cycle_days = 14;
            break;
          case '3 weeks':
            contribution_cycle_days = 21;
            break;
          case 'Monthly':
            contribution_cycle_days = 30;
            break;
          default:
            break;
        }

        var given_amount = doc.amount - parseInt(req.body.transaction_fee);
        var amount = doc.amount * (parseInt(req.body.interest_rate) + 100) / 100;

        if (doc.chairperson_approved == true && doc.secretary_approved == true && doc.treasure_approved == true) {

            //------------------m-pesa transaction(B2C)------------------

            if (given_amount > 0 ) {

              var end_at = new Date();
              end_at.setDate(end_at.getDate() + contribution_cycle_days);

              const request_options= {
                    "InitiatorName": initiator,
                    "SecurityCredential":secretCredential,
                    "CommandID": "SalaryPayment",
                    "Amount": given_amount,
                    "PartyA": shortCodeB2C,
                    "PartyB": req.body.phone,
                    "Remarks": "payemployees",
                    "QueueTimeOutURL": "https://api.chamaplus.com/B2CTimeout",
                    "ResultURL": "https://api.chamaplus.com/B2CSuccess/borrow/" + doc.chama_code + "/" + end_at,
                    "Occasion": ""
                  };

                  await pendingSchema.remove({_id: req.body.id});
                 
                  await mpesaSDK.b2c(request_options,function(data){
                      console.log(data);
                  })
            }

            //-----------------------------------------------------------

            res.status(201).json({success: true, message: 'Transaction approved.'})
        }
        else {
            await pendingSchema.update({_id: req.body.id}, doc);
            res.status(201).json({success: true, message: 'Successfully approved.'});
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.updateMerryGoRound = async function (req, res) {
    try {
      var round = await roundSchema.findOne({chama_code: req.body.chama_code, phone: req.body.phone, accept_status: 'waiting'});
      if (round != null) {
        round.accept_status = req.body.accept_status;

        if (req.body.accept_status == 'accept') {
            //------------------m-pesa transaction(B2C)------------------

            const request_options= {
                "InitiatorName": initiator,
                "SecurityCredential":secretCredential,
                "CommandID": "SalaryPayment",
                "Amount": round.amount,
                "PartyA": shortCodeB2C,
                "PartyB": req.body.phone,
                "Remarks": "payemployees",
                "QueueTimeOutURL": "https://api.chamaplus.com/B2CTimeout",
                "ResultURL": "https://api.chamaplus.com/B2CSuccess/merry/" + req.body.chama_code,
                "Occasion": ""
            };

            await mpesaSDK.b2c(request_options,function(data){
                console.log(data);
            })
            //-----------------------------------------------------------

            await roundSchema.update({chama_code: req.body.chama_code, phone: req.body.phone, accept_status: 'waiting'}, round);

            res.status(201).json({success: true, message: 'Processing merry-go-round...'});
        }
        else {
            await roundSchema.update({chama_code: req.body.chama_code, phone: req.body.phone, accept_status: 'waiting'}, round);
            res.status(201).json({success: true, message: 'Merry-Go-Round declined.'});
        }        
  
      }
      else {
        res.status(201).json({success: false, message: "There's no such merry-go-round."});
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({success: false, error: error});
    }
}
