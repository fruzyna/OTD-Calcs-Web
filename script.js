start();
function start()
{
  otd();

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
}

function otd()
{
  document.getElementById("calcotd").style.display = 'block';
  document.getElementById("calcprice").style.display = 'none';
}

function price()
{
  document.getElementById("calcotd").style.display = 'none';
  document.getElementById("calcprice").style.display = 'block';
}

function findPrice()
{
  var form = document.getElementById("price-form");
  var otd = parseFloat(form.elements["otd"].value);
  var ltRadios = form.elements["lt"];
  var taxRadios = form.elements["tax"];
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
      lt = 196;
      break;
    case 1:
      lt = 120;
      break;
    case 2:
      //other
      lt = parseFloat(form.elements["other-lt"].value);
      break;
  }
  var subtotal1 = otd - lt;
  document.getElementById("price-subtotal1").innerHTML = round(subtotal1, 2);
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
      //dupage
      tax += 0.0700;
      break;
    case 1:
      //cook
      tax += 0.0800;
      break;
    case 2:
      //city
      tax += 0.0925;
      break;
    case 3:
      //other
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
  var trade = parseFloat(form.elements["trade"].value);
  var subtotal2 = subtotal1 / tax + trade;
  document.getElementById("price-subtotal2").innerHTML = round(subtotal2, 2);
  var doc = parseFloat(form.elements["doc"].value);
  var total = subtotal2 - doc;
  document.getElementById("price-total").innerHTML = round(total, 2);
}

function round(value, decimals)
{
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function findOTD()
{
  var form = document.getElementById("otd-form");
  var price = parseFloat(form.elements["price"].value);
  var doc = parseFloat(form.elements["doc"].value);
  var trade = parseFloat(form.elements["trade"].value);
  var subtotal = price + doc - trade;
  document.getElementById("otd-subtotal").innerHTML = round(subtotal, 2);
  var taxRadios = form.elements["tax"];
  var ltRadios = form.elements["lt"];
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
      //dupage
      tax += 0.0700;
      break;
    case 1:
      //cook
      tax += 0.0800;
      break;
    case 2:
      //city
      tax += 0.0925;
      break;
    case 3:
      //other
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
      lt = 196;
      break;
    case 1:
      lt = 120;
      break;
    case 2:
      //other
      lt = parseFloat(form.elements["other-lt"].value);
      break;
  }
  var total = subtotal * tax + lt;
  document.getElementById("otd-total").innerHTML = round(total, 2);
}
