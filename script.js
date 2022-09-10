// colors for tabs
var selected   = '#edae49';
var unselected = '#d81e5b';

// taxes
var dupage  = 0.0700;
var cook    = 0.0800;
var chicago = 0.0925;

// plate fees
var newPlate = 306;
var transfer = 180;

// doc fee
var doc = 359.24;

// register service workers for PWA
if ('serviceWorker' in navigator)
{
  navigator.serviceWorker.register('pwa.js')
}

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
  // opens in otd mode
  otd();

  // sets listeners to update everytime a value is changed
  var form = document.getElementById("otd-form");
  form.elements["price"].addEventListener('input', findOTD);
  form.elements["rebate"].addEventListener('input', findOTD);
  form.elements["doc"].addEventListener('input', findOTD);
  form.elements["trade"].addEventListener('input', findOTD);
  form.elements["other-percent"].addEventListener('input', findOTD);
  form.elements["other-lt"].addEventListener('input', findOTD);
  form.elements["payoff"].addEventListener('input', findOTD);
  form.elements["il-resident"].addEventListener('input', findOTD);

  var form = document.getElementById("price-form");
  form.elements["otd"].addEventListener('input', findPrice);
  form.elements["doc"].addEventListener('input', findPrice);
  form.elements["trade"].addEventListener('input', findPrice);
  form.elements["other-percent"].addEventListener('input', findPrice);
  form.elements["other-lt"].addEventListener('input', findPrice);
  form.elements["payoff"].addEventListener('input', findPrice);
  form.elements["rebate"].addEventListener('input', findPrice);
  form.elements["il-resident"].addEventListener('input', findPrice);
}

// adjust for mobile
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
  if((new Date()).getFullYear() >= 2020)
  {
    document.getElementById("otd-form").elements["il-resident"].checked = true;
  }
}

// prepares price mode
function price()
{
  document.getElementById("otd-form").style.display = 'none';
  document.getElementById("price-form").style.display = 'block';
  document.getElementById("otd-tab").style.backgroundColor = unselected;
  document.getElementById("price-tab").style.backgroundColor = selected;
  if((new Date()).getFullYear() >= 2020)
  {
    document.getElementById("price-form").elements["il-resident"].checked = true;
  }
}

// sets the text of an element to a value or $XXX.XX
function setValue(id, value)
{
  if(isNaN(value))
  {
    document.getElementById(id).innerHTML = "XXX.XX";
  }
  else
  {
    document.getElementById(id).innerHTML = round(value, 2);
  }
}

// calulates the price
function findPrice()
{
  // get all inputs
  var form = document.getElementById("price-form");
  var otd = parseFloat(form.elements["otd"].value);
  var trade = parseFloat(form.elements["trade"].value);
  var doc = parseFloat(form.elements["doc"].value);
  var rebate = parseFloat(form.elements["rebate"].value);
  var payoff = parseFloat(form.elements["payoff"].value);
  var ilResident = form.elements["il-resident"].checked;
  var ltRadios = form.elements["lt"];
  var taxRadios = form.elements["tax"];

  if(isNaN(payoff))
  {
    payoff = 0
  }
  if(isNaN(rebate))
  {
    rebate = 0
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
  var lt;
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
      //other
      lt = parseFloat(form.elements["other-lt"].value);
      break;
  }

  // calculates and displays the first subtotal
  var subtotal1 = otd + rebate - lt - payoff;
  setValue("price-subtotal1", subtotal1);

  // determines which tax radio button is selected
  for(i = 0; i < taxRadios.length; i++)
  {
    if(taxRadios[i].checked)
    {
      break;
    }
  }
  var tax;
  switch(i)
  {
    case 0:
      // dupage
      tax = dupage;
      break;
    case 1:
      // cook
      tax = cook;
      break;
    case 2:
      // city
      tax = chicago;
      break;
    case 3:
      // other
      var other = parseFloat(form.elements["other-percent"].value);
      if(other >= 0.5)
      {
        tax = other / 100;
      }
      else {
        tax = other;
      }
      break;
  }

  // calculates and displays the tax
  var afterTax = subtotal1;
  var taxTotal = 0;
  if(ilResident && trade > 10000)
  {
    var tradeTax = (trade - 10000) * tax;
    taxTotal += tradeTax;
    afterTax -= (trade - 10000) * tax;
  }
  var beforeTax = afterTax / (1 + tax)
  taxTotal += afterTax - beforeTax;
  setValue("price-tax", taxTotal);

  // calculates and displays the second subtotal
  var subtotal2 = beforeTax + trade;
  setValue("price-subtotal2", subtotal2);

  // calculates and displays the total
  var total = subtotal2 - doc;
  setValue("price-total", total);
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
  var rebate = parseFloat(form.elements["rebate"].value);
  var doc = parseFloat(form.elements["doc"].value);
  var trade = parseFloat(form.elements["trade"].value);
  var payoff = parseFloat(form.elements["payoff"].value);
  var ilResident = form.elements["il-resident"].checked;
  var taxRadios = form.elements["tax"];
  var ltRadios = form.elements["lt"];

  if(isNaN(rebate))
  {
    rebate = 0;
  }
  if(isNaN(trade))
  {
    trade = 0;
  }

  // calculates and displays the price after rebate
  var afterRebate = price - rebate;
  setValue("after-rebate", afterRebate);

  // calculates and displays the subtotal
  var subtotal = price + doc - trade;
  setValue("otd-subtotal", subtotal);

  //determines which tax radio button is selected
  var i;
  for(i = 0; i < taxRadios.length; i++)
  {
    if(taxRadios[i].checked)
    {
      break;
    }
  }
  var tax;
  switch(i)
  {
    case 0:
      // dupage
      tax = dupage;
      break;
    case 1:
      // cook
      tax = cook;
      break;
    case 2:
      // city
      tax = chicago;
      break;
    case 3:
      // other
      var other = parseFloat(form.elements["other-percent"].value);
      if(other >= 0.5)
      {
        tax = other / 100;
      }
      else {
        tax = other;
      }
      break;
  }

  // calculates and displays the tax
  var taxTotal = subtotal * tax;
  if(ilResident && trade > 10000)
  {
    taxTotal = (price + doc - 10000) * tax;
  }
  setValue("otd-tax", taxTotal);

  // determines which lt radio button is selected
  for(i = 0; i < ltRadios.length; i++)
  {
    if(ltRadios[i].checked)
    {
      break;
    }
  }
  var lt;
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
  var total = subtotal + taxTotal + lt + payoff - rebate;
  setValue("otd-total", total);
}