// GET Method for generating fuel quotes
app.get('/generateQuote', function(req, res) (
	var userName = req.session.username;
	var requestedAmount = req.body.gallons;
	var inState = false;
	var queryString = '';
	var msg = '';
	var multiplier = 1.0;
	var regTotal = 0.0;
	var basePriceOut = 2.5;
	var adjPriceOut = 0.0;
	var totalPriceOut = 0.0;
	
	if (userName && requestedAmount)
	{
		// set inState
		queryString = 'SELECT * FROM clientInformation WHERE username = ?';
		con.query(queryString, [userName], function(error, results, fields)
		{
			if (results.length > 0)
			{
				inState = (results[0].state == 'TX');
				if (!inState)
				{
					multiplier = 1.15;
				}
			}
			else
			{
				msg = 'User not found'; // shouldn't actually happen
				
				alert(msg);
				throw error;
			}
		}
		
		queryString = 'SELECT gallonsRequested, totalDue FROM fuelQuote';
		con.query(queryString, function(error, results, fields)
		{
			if (results.length > 0)
			{
				var a = linearRegression(results, false);
				var b = linearRegression(results, true);
				
				regTotal = b * requestedAmount + a;
				
				if (regTotal == -1.0)	//	no data found
				{
					adjPriceOut = multiplier * basePriceOut;
					totalPriceOut = adjPriceOut * gallonsRequested;
				}
				else
				{
					basePriceOut = regTotal / requestedAmount;
					adjPriceOut = basePriceOut * multiplier;
					totalPriceOut = adjPriceOut * requestedAmount;
				}
			}
			else
			{
				adjPriceOut = multiplier * basePriceOut;
				totalPriceOut = adjPriceOut * gallonsRequested;
			}
			
			var result = {
				unitPrice: adjPriceOut,
				totalPrice: totalPriceOut
			};
			
			res.send(result);
		}
	}
	else
	{
		msg = 'You must be logged in and have a valid requested amount'; // shouldn't actually happen, but cover it just in case
		alert(msg);
	}
});

function linearRegression(data, returnSlope)
{
	var i;
	var sumY = 0.0;
	var sumXSq = 0.0;
	var sumX = 0.0;
	var sumXY = 0.0;
	var n = data.length;
	
	if (n > 0)
	{
		for (i = 0; i < n; i++)
		{
			sumY += data[i].totalDue;
			sumXSq += Math.pow(data[i].gallonsRequested, 2.0);
			sumX += data[i].gallonsRequested;
			sumXY += data[i].gallonsRequested * data[i].totalDue;
		}
		
		if (returnSlope)
		{
			return (n * sumXY - sumX * sumY) / (n * sumXSq - Math.pow(sumX, 2.0));
		}
		else
		{
			return (sumY * sumXSq - sumX * sumXY) / (n * sumXSq - Math.pow(sumX, 2.0));
		}
	}
	else
	{
		return -1.0;
	}
}