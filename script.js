// colors for tabs
var selected   = '#edae49';
var unselected = '#d81e5b';

// taxes
var dupage  = 0.0700;
var cook    = 0.0800;
var chicago = 0.0925;

// plate fees
var newPlate = 251;
var transfer = 175;

// doc fee
var doc = 204.81;

// replace all string
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

// replace placeholders in html document
document.body.innerHTML = document.body.innerHTML.replaceAll("[[DUPAGE]]",   (dupage * 100).toFixed(2))
document.body.innerHTML = document.body.innerHTML.replaceAll("[[COOK]]",     (cook * 100).toFixed(2))
document.body.innerHTML = document.body.innerHTML.replaceAll("[[CHICAGO]]",  (chicago * 100).toFixed(2))
document.body.innerHTML = document.body.innerHTML.replaceAll("[[NEW]]",      newPlate)
document.body.innerHTML = document.body.innerHTML.replaceAll("[[TRANSFER]]", transfer)
document.body.innerHTML = document.body.innerHTML.replaceAll("[[DOC]]",      doc)

start();
function start()
{
  //opens in otd mode
  otd();

  // sets listeners to update everytime a value is changed
  var form = document.getElementById("otd-form");
  form.elements["price"].addEventListener('input', function (evt) {
    findOTD();
  });
  form.elements["doc"].addEventListener('input', function (evt) {
    findOTD();
  });
  form.elements["trade"].addEventListener('input', function (evt) {
    findOTD();
  });
  form.elements["other-percent"].addEventListener('input', function (evt) {
    findOTD();
  });
  form.elements["other-lt"].addEventListener('input', function (evt) {
    findOTD();
  });
  form.elements["payoff"].addEventListener('input', function (evt) {
    findOTD();
  });

  var form = document.getElementById("price-form");
  form.elements["otd"].addEventListener('input', function (evt) {
    findPrice();
  });
  form.elements["doc"].addEventListener('input', function (evt) {
    findPrice();
  });
  form.elements["trade"].addEventListener('input', function (evt) {
    findPrice();
  });
  form.elements["other-percent"].addEventListener('input', function (evt) {
    findPrice();
  });
  form.elements["other-lt"].addEventListener('input', function (evt) {
    findPrice();
  });
  form.elements["payoff"].addEventListener('input', function (evt) {
    findPrice();
  });
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))
{
  var viewport = document.querySelector('meta[name="viewport"]');
  if (viewport)
  {
    viewport.content = "width=480";
  }
}

// prepares otd mode
function otd()
{
  document.getElementById("otd-form").style.display = 'block';
  document.getElementById("price-form").style.display = 'none';
  document.getElementById("otd-tab").style.backgroundColor = selected;
  document.getElementById("price-tab").style.backgroundColor = unselected;
}

// prepares price mode
function price()
{
  document.getElementById("otd-form").style.display = 'none';
  document.getElementById("price-form").style.display = 'block';
  document.getElementById("otd-tab").style.backgroundColor = unselected;
  document.getElementById("price-tab").style.backgroundColor = selected;
}

// calulates the price
function findPrice()
{
  // get all inputs
  var form = document.getElementById("price-form");
  var otd = parseFloat(form.elements["otd"].value);
  var trade = parseFloat(form.elements["trade"].value);
  var doc = parseFloat(form.elements["doc"].value);
  var payoff = parseFloat(form.elements["payoff"].value);
  var ltRadios = form.elements["lt"];
  var taxRadios = form.elements["tax"];

  if(isNaN(payoff))
  {
    payoff = 0
  }

  // determines which lt radio button is selected
  var i;
  for(i = 0; i < ltRadios.length; i++)
  {
    if(ltRadios[i].checked)
    {
      break;
    }
  }
  var lt = 0;
  switch(i)
  {
    case 0:
      // new
      lt = transfer;
      break;
    case 1:
      // transfer
      lt = newPlate;
      break;
    case 2:
      //other
      lt = parseFloat(form.elements["other-lt"].value);
      break;
  }

  // calculates and displays the first subtotal
  var subtotal1 = otd - lt - payoff;
  document.getElementById("price-subtotal1").innerHTML = round(subtotal1, 2);

  // determines which tax radio button is selected
  for(i = 0; i < taxRadios.length; i++)
  {
    if(taxRadios[i].checked)
    {
      break;
    }
  }
  var tax = 1.0000;
  switch(i)
  {
    case 0:
      // dupage
      tax += dupage;
      break;
    case 1:
      // cook
      tax += cook;
      break;
    case 2:
      // city
      tax += chicago;
      break;
    case 3:
      // other
      var other = parseFloat(form.elements["other-percent"].value);
      if(other >= 0.5)
      {
        tax += other / 100;
      }
      else {
        tax += other;
      }
      break;
  }

  // calculates and displays the tax
  var taxTotal = subtotal1 - (subtotal1 / tax);
  document.getElementById("price-tax").innerHTML = round(taxTotal, 2);

  // calculates and displays the second subtotal
  var subtotal2 = subtotal1 / tax + trade;
  document.getElementById("price-subtotal2").innerHTML = round(subtotal2, 2);

  // calculates and displays the total
  var total = subtotal2 - doc;
  document.getElementById("price-total").innerHTML = round(total, 2);
}

// rounds a given value to a given number of decimal places
function round(value, decimals)
{
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

// calculates the otd
function findOTD()
{
  // get all inputs
  var form = document.getElementById("otd-form");
  var price = parseFloat(form.elements["price"].value);
  var doc = parseFloat(form.elements["doc"].value);
  var trade = parseFloat(form.elements["trade"].value);
  var payoff = parseFloat(form.elements["payoff"].value);
  var taxRadios = form.elements["tax"];
  var ltRadios = form.elements["lt"];

  // calculates and displays the subtotal
  var subtotal = price + doc - trade;
  document.getElementById("otd-subtotal").innerHTML = round(subtotal, 2);

  //determines which tax radio button is selected
  var i;
  for(i = 0; i < taxRadios.length; i++)
  {
    if(taxRadios[i].checked)
    {
      break;
    }
  }
  var tax = 1.0000;
  switch(i)
  {
    case 0:
      // dupage
      tax += dupage;
      break;
    case 1:
      // cook
      tax += cook;
      break;
    case 2:
      // city
      tax += chicago;
      break;
    case 3:
      // other
      var other = parseFloat(form.elements["other-percent"].value);
      if(other >= 0.5)
      {
        tax += other / 100;
      }
      else {
        tax += other;
      }
      break;
  }

  // calculates and displays the tax
  var taxTotal = subtotal * (tax - 1);
  document.getElementById("otd-tax").innerHTML = round(taxTotal, 2);

  // determines which lt radio button is selected
  for(i = 0; i < ltRadios.length; i++)
  {
    if(ltRadios[i].checked)
    {
      break;
    }
  }
  var lt = 0;
  switch(i)
  {
    case 0:
      // new
      lt = newPlate;
      break;
    case 1:
      // transfer
      lt = transfer;
      break;
    case 2:
      // other
      lt = parseFloat(form.elements["other-lt"].value);
      break;
  }

  if(isNaN(payoff))
  {
    payoff = 0
  }

  // calculates and displays the total
  var total = subtotal * tax + lt + payoff;
  document.getElementById("otd-total").innerHTML = round(total, 2);
}
