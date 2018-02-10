const Dia_chi_Media = "../Media";

// ****** Các hàm bổ trợ ********
function Convert_Date(date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth() + 1).toString();
  var dd = date.getDate().toString();

  var mmChars = mm.split("");
  var ddChars = dd.split("");

  return (
    yyyy +
    "-" +
    (mmChars[1] ? mm : mmChars[0]) +
    "-" +
    (ddChars[1] ? dd : ddChars[0])
  );
}

function Change_Amount(amount_Text, Html_Lable_Total_Price, price, isIncrease) {
  var iAmount = parseInt(amount_Text.value);

  if (isIncrease != null) {
    if (isIncrease == true) {
      iAmount++;
    } else {
      if (iAmount > 1) {
        iAmount--;
      }
    }
  }

  amount_Text.value = iAmount;
  Html_Lable_Total_Price.innerHTML = `Thành tiền: ${parseInt(price) * iAmount} VNĐ`;
}

// ****** Xử lý Thể hiện ********
function Create_Html_List_Items(List_Items_Data) {  
  let Html_List_Items = document.createElement("div");
  Html_List_Items.className = "row";

  //var Mat_hangs = Danh_sach_Mat_hang;

  for (let i = 0; i < List_Items_Data.length; i++) {
    if (List_Items_Data[i].nodeType != 1) {
      continue;
    }

    //let matHangText = new XMLSerializer().serializeToString(Mat_hangs[i]);
    //let item_Seri = List_Items_Data[i].getAttribute("Ma_so");
    let item_Data = List_Items_Data[i];

    var Html_Item_Img = document.createElement("img");
    Html_Item_Img.src = `${Dia_chi_Media}/${List_Items_Data[i].getAttribute("Ma_so")}.png`;
    Html_Item_Img.style.cssText = `width:150px;height:150px;`;

    var Html_Item_Info = document.createElement("div");
    Html_Item_Info.className = `btn info-lable`;
    Html_Item_Info.style.cssText = `text-align:left`;
    Html_Item_Info.innerHTML = `${List_Items_Data[i].getAttribute("Ten")}
                  <br />Đơn giá Bán 
                   ${List_Items_Data[i].getAttribute("Don_gia_Ban")}`;

    var Html_Item_Btn_Pay = document.createElement("button");
    Html_Item_Btn_Pay.className = `btn btn-primary btn-lg btn-block`;
    Html_Item_Btn_Pay.style.cssText = `text-align:left;margin-top:10px`;
    Html_Item_Btn_Pay.innerHTML = `Tính tiền`;
    Html_Item_Btn_Pay.onclick = function() {
      onClick_Item_Btn_Pay(item_Data);
    };

    var Html_Item_Btn_Revenue = document.createElement("button");
    Html_Item_Btn_Revenue.className = `btn btn-warning btn-lg btn-block`;
    Html_Item_Btn_Revenue.style.cssText = `text-align:left;margin-top:10px`;
    Html_Item_Btn_Revenue.innerHTML = `Doanh thu`;
    Html_Item_Btn_Revenue.onclick = function() {
      onClick_Item_Btn_Revenue(item_Data);
    };

    var Html_Item = document.createElement("div");
    Html_Item.className = `col-md-3`;
    Html_Item.style.cssText = `margin-bottom:40px`;
    Html_Item.appendChild(Html_Item_Img);
    Html_Item.appendChild(Html_Item_Info);
    Html_Item.appendChild(Html_Item_Btn_Pay);
    Html_Item.appendChild(Html_Item_Btn_Revenue);

    Html_List_Items.appendChild(Html_Item);
  }

  return Html_List_Items;
}

function Create_Html_Amount_Items(Danh_sach_Mat_hang) {
  let amountCoffeeItems = 0;
  let listLength = Danh_sach_Mat_hang.length;

  for (let i = 0; i < listLength; i++) {
    if (Danh_sach_Mat_hang[i].nodeType != 1) {
      continue;
    }

    if (
      Danh_sach_Mat_hang[i]
        .getElementsByTagName("Nhom_Mat_hang")[0]
        .getAttribute("Ten") == "Cà phê"
    ) {
      amountCoffeeItems++;
    }
  }

  return `<div class='alert alert-info'>
  Chúng tôi hiện có ${Danh_sach_Mat_hang.length} mặt hàng 
  <br /><i style='color:blue' >TqbDev : Cà phê: ${amountCoffeeItems} sản phẩm và Món ăn: ${listLength - amountCoffeeItems}</i>
  </div>`
}

//************** Xử lý Nghiệp vụ ***********
function Query_Items_by_String(Query_String, List_Items_Data) {
  Query_String = Query_String.toUpperCase();
  let Result_List_Items = [];

  for (let i = 0; i < List_Items_Data.length; i++) {
    if (List_Items_Data[i].nodeType != 1) {
      continue;
    }

    let Item_Name = List_Items_Data[i].getAttribute("Ten").toUpperCase();
    if (Item_Name.indexOf(Query_String) >= 0) Result_List_Items.push(List_Items_Data[i]);
  }

  return Result_List_Items;
}

function onClick_Item_Btn_Revenue(item_Data) {
  global_XML_Doc_Data = Load_XML_from_File();

  var item_Seri = item_Data.getAttribute("Ma_so");
  var path_Ban_hang =
    "/Du_lieu/Danh_sach_Mat_hang/Mat_hang[@Ma_so='" + item_Seri + "']/Danh_sach_Ban_hang/Ban_hang";
  var nodes = global_XML_Doc_Data.evaluate(
    path_Ban_hang,
    global_XML_Doc_Data,
    null,
    XPathResult.ANY_TYPE,
    null
  );
  var result_Ban_hang = nodes.iterateNext();

  //var path_Mat_hang = "//Mat_hang[@Ma_so='" + item_Seri + "']";
  //var nodes_Mat_hang = global_XML_Doc_Data.evaluate(path_Mat_hang, global_XML_Doc_Data, null, XPathResult.ANY_TYPE, null);
  //var result_Mat_hang = nodes_Mat_hang.iterateNext();

  // Modal Revenue
  var modal_Revenue = document.createElement("div");
  modal_Revenue.className = `modal`;
  modal_Revenue.style.paddingTop = `${
    window.parent.document.documentElement.scrollTop
  }px`;
  modal_Revenue.style.display = `block`;

  window.parent.onscroll = function() {
    modal_Revenue.style.paddingTop = `${
      window.parent.document.documentElement.scrollTop
    }px`;
  };
  //
  // Modal-content
  var modal_Content = document.createElement("div");
  modal_Content.className = `modal-content animate-zoom`;

  if (window.parent.innerHeight > window.parent.innerWidth) {
    modal_Content.style.width = `100%`;
  } else {
    modal_Content.style.width = `70%`;
  }

  window.parent.onresize = function() {
    if (window.parent.innerHeight > window.parent.innerWidth) {
      modal_Content.style.width = `100%`;
    } else {
      modal_Content.style.width = `70%`;
    }
  };
  //
  // Modal-header
  var modal_Header = document.createElement("div");
  modal_Header.className = `modal-header`;

  var close = document.createElement("span");
  close.className = `close`;
  close.innerHTML = `&times;`;
  close.onclick = function() {
    modal_Revenue.style.display = `none`;
  };

  var header = document.createElement("h2");
  header.innerHTML = `Doanh thu <b style="color:black">${item_Data.getAttribute("Ten")}</b> (${Convert_Date(new Date())})`;

  modal_Header.appendChild(header);
  modal_Header.appendChild(close);

  modal_Content.appendChild(modal_Header);
  //
  // Modal-body
  var Html_Item = document.createElement("div");
  Html_Item.className = `row`;

  var Html_Item_Img = document.createElement("div");
  Html_Item_Img.className = `col-sm-6 itemImg`;
  Html_Item_Img.innerHTML = `<img class="img-responsive" alt="" src="${Dia_chi_Media}/${item_Seri}.png"/>`

  var Html_Item_Info = document.createElement("div");
  Html_Item_Info.className = `col-sm-6`;
  Html_Item_Info.style.cssText = `margin-top: 10px; margin-bottom: 10px`;
  Html_Item_Info.innerHTML = `<div class="row" style="margin-right: 10px;">
                              <div class="col-sm-4 border custom-lable"><b>Đơn giá</b></div>
                              <div class="col-sm-4 border custom-lable"><b>Số lượng</b></div>
                              <div class="col-sm-4 border custom-lable"><b style="color:red;">Thành tiền</b></div>
                            </div>`

  var total_Revenue = 0

  if (result_Ban_hang == null) {
  } else {
    while (result_Ban_hang) {
      if (result_Ban_hang.getAttribute("Ngay") == Convert_Date(new Date())) {
        var report = document.createElement("div");
        report.className = `row`;
        report.style.cssText = `margin-right: 10px;`;

        var unit_Price = document.createElement("div");
        unit_Price.className = `col-sm-4 border custom-lable`;
        unit_Price.innerHTML = `${result_Ban_hang.getAttribute("Don_gia")}`;

        var amount = document.createElement("div");
        amount.className = `col-sm-4 border custom-lable`;
        amount.innerHTML = `${result_Ban_hang.getAttribute("So_luong")}`;

        var total_Price = document.createElement("div");
        total_Price.className = `col-sm-4 border custom-lable`;
        total_Price.innerHTML = `${result_Ban_hang.getAttribute("Tien")}`;

        total_Revenue += parseInt(total_Price.innerHTML);

        report.appendChild(unit_Price);
        report.appendChild(amount);
        report.appendChild(total_Price);

        Html_Item_Info.appendChild(report);
      } else {
      }
      result_Ban_hang = nodes.iterateNext();
    }
  }

  var report = document.createElement("div");
  report.className = `row`;
  report.style.cssText = `margin-right: 10px;`;
  report.innerHTML = `<div class="col-sm-8 border custom-lable"><b>Tổng doanh thu</b></div>
                      <div class="col-sm-4 border custom-lable"><b style="color:red;">${total_Revenue}</b></div>`
  
  Html_Item_Info.appendChild(report);
  
  Html_Item.appendChild(Html_Item_Img);
  Html_Item.appendChild(Html_Item_Info);

  modal_Content.appendChild(Html_Item);
  //
  // Modal-footer
  var modal_Footer = document.createElement("div");
  modal_Footer.className = `modal-footer`;

  modal_Content.appendChild(modal_Footer);
  //

  modal_Revenue.appendChild(modal_Content);
  document.body.appendChild(modal_Revenue);
}

function onClick_Item_Btn_Pay(item_Data) {
  // var Mat_hang;
  // var parser = new DOMParser();
  // if (Mat_hang_text != "") {
  //   Mat_hang = parser.parseFromString(Mat_hang_text, "text/xml");
  // }
  // Mat_hang = Mat_hang.getElementsByTagName("Mat_hang")[0];

  //var Mat_hang = Mat_hang_text;

  var modal_Payment = document.createElement("div");
  modal_Payment.className = `modal`;
  modal_Payment.style.paddingTop = `${
    window.parent.document.documentElement.scrollTop
  }px`;
  modal_Payment.style.display = `block`;

  window.parent.onscroll = function() {
    modal_Payment.style.paddingTop = `${
      window.parent.document.documentElement.scrollTop
    }px`;
  };

  var modal_Content = document.createElement("div");
  modal_Content.className = `modal-content animate-zoom`;

  if (window.parent.innerHeight > window.parent.innerWidth) {
    modal_Content.style.width = `100%`;
  } else {
    modal_Content.style.width = `50%`;
  }

  window.parent.onresize = function() {
    window.parent.resizeMainIframe();

    if (window.parent.innerHeight > window.parent.innerWidth) {
      modal_Content.style.width = `100%`;
    } else {
      modal_Content.style.width = `50%`;
    }
  };
  // Modal Header
  var modal_Header = document.createElement("div");
  modal_Header.className = `modal-header`;

  var close = document.createElement("span");
  close.className = `close`;
  close.innerHTML = `&times;`;
  close.onclick = function() {
    modal_Payment.style.display = `none`;
  };

  var header = document.createElement("h2");
  header.innerHTML = `Thanh toán`;

  modal_Header.appendChild(header);
  modal_Header.appendChild(close);

  modal_Content.appendChild(modal_Header);
  //
  // Modal body
  var Html_Item_Img = document.createElement("div");
  Html_Item_Img.className = `col-sm-6 itemImg`;
  Html_Item_Img.innerHTML = `<img class="img-responsive" alt="" src="${Dia_chi_Media}/${item_Data.getAttribute("Ma_so")}.png"/>`

  var Html_Item_Info = document.createElement("div");
  Html_Item_Info.className = `col-sm-6`;

  var Html_Item_Name = document.createElement("lable");
  Html_Item_Name.className = `row custom-lable noselect`;
  Html_Item_Name.style.cssText = `margin-top: 15px; margin-left:10px`;
  Html_Item_Name.innerHTML = `Tên: ${item_Data.getAttribute("Ten")}`;

  var Html_Item_Unit_Price = document.createElement("lable");
  Html_Item_Unit_Price.className = `row custom-lable noselect`;
  Html_Item_Unit_Price.style.cssText = `margin-top: 15px; margin-left:10px`;
  Html_Item_Unit_Price.innerHTML = `Đơn giá: ${item_Data.getAttribute("Don_gia_Ban")} VNĐ`;

  // Total price
  var Html_Lable_Total_Price = document.createElement("lable");
  Html_Lable_Total_Price.className = `custom-lable noselect`;
  Html_Lable_Total_Price.style.cssText = `color: #ff0000; font-weight: bold; margin-left:10px`;
  Html_Lable_Total_Price.innerHTML = `Thành tiền: ${item_Data.getAttribute(
    "Don_gia_Ban"
  )} VNĐ`;
  //
  // Amount
  var amount_div = document.createElement("div");
  amount_div.className = `row`;
  amount_div.style.cssText = `margin-left:10px; margin-bottom: 20px`

  var lable = document.createElement("lable");
  lable.className = `custom-lable noselect`;
  lable.style.cssText = `margin-top: 15px;`;
  lable.innerHTML = `Số lượng:`;

  var amount_Text = document.createElement("input");
  amount_Text.className = `custom-lable`;
  amount_Text.style.cssText = `width: 100px; height: 40px; margin-top: 15px;margin-bottom: 10px;`;
  amount_Text.value = 1;
  amount_Text.onkeyup = () => {
    amount_Text.value = amount_Text.value.replace(/[^0-9\.]/g, "");
    if (amount_Text.value == "") {
      amount_Text.value = 1;
    }

    Change_Amount(
      amount_Text,
      Html_Lable_Total_Price,
      item_Data.getAttribute("Don_gia_Ban"),
      null
    );
  };

  var decrease_Amount = document.createElement("button");
  decrease_Amount.className = `btn btn-danger btn-sm custom-lable custom-amount-btn`;
  decrease_Amount.innerHTML = `-`;
  decrease_Amount.onclick = function() {
    Change_Amount(
      amount_Text,
      Html_Lable_Total_Price,
      item_Data.getAttribute("Don_gia_Ban"),
      false
    );
  };

  var increase_Amount = document.createElement("button");
  increase_Amount.className = `btn btn-success btn-sm custom-lable custom-amount-btn`;
  increase_Amount.innerHTML = `+`;
  increase_Amount.onclick = function() {
    Change_Amount(
      amount_Text,
      Html_Lable_Total_Price,
      item_Data.getAttribute("Don_gia_Ban"),
      true
    );
  };

  amount_div.appendChild(lable);
  amount_div.appendChild(decrease_Amount);
  amount_div.appendChild(amount_Text);
  amount_div.appendChild(increase_Amount);
  //

  Html_Item_Info.appendChild(Html_Item_Name);
  Html_Item_Info.appendChild(Html_Item_Unit_Price);
  Html_Item_Info.appendChild(amount_div);
  Html_Item_Info.appendChild(Html_Lable_Total_Price);

  var Html_Item = document.createElement("div");
  Html_Item.className = `row`;

  Html_Item.appendChild(Html_Item_Img);
  Html_Item.appendChild(Html_Item_Info);

  modal_Content.appendChild(Html_Item);
  //
  // Modal Footer
  var modal_Footer = document.createElement("div");
  modal_Footer.className = `modal-footer`;

  var Html_Pay_Btn_Paid = document.createElement("button");
  Html_Pay_Btn_Paid.className = `btn btn-primary btn-md btn-block custom-lable`;
  Html_Pay_Btn_Paid.style.cssText = `margin:10px`;
  Html_Pay_Btn_Paid.innerHTML = `Tính tiền`;
  Html_Pay_Btn_Paid.onclick = function() {
    modal_Payment.style.display = `none`;

    let xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        console.log("POST", "/PostDuLieu", this.responseText);
      }
    });

    let params = "itemseri=" + item_Data.getAttribute("Ma_so") + "&amount=" + amount_Text.value;

    xhr.open("POST", "/PostDuLieu", true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.send(params);
  };

  var btn_Huy = document.createElement("button");
  btn_Huy.className = `btn btn-danger btn-md btn-block custom-lable`;
  btn_Huy.style.cssText = `margin:10px`;
  btn_Huy.innerHTML = `Hủy`;
  btn_Huy.onclick = function() {
    modal_Payment.style.display = `none`;
  };

  modal_Footer.appendChild(btn_Huy);
  modal_Footer.appendChild(Html_Pay_Btn_Paid);

  modal_Content.appendChild(modal_Footer);
  //

  modal_Payment.appendChild(modal_Content);

  document.body.appendChild(modal_Payment);
}

//************** Xử lý Lưu trữ ***********
function Load_XML_from_File() {
  let xmlDoc = null;

  let xhr = new XMLHttpRequest();
  xhr.open("GET", "../2-Du_lieu_Luu_tru/Du_lieu.xml", false);
  xhr.send("");
  let XML_String = xhr.responseText.trim();

  let parser = new DOMParser();
  if (XML_String != "") {
    xmlDoc = parser.parseFromString(XML_String, "text/xml");
  }

  return xmlDoc;
}