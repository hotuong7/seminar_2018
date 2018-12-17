
App = {
  web3Provider: null,
  contracts: {},

  init: function () {
    // Load pets.
    // $.getJSON('../pets.json', function(data) {
    //   var petsRow = $('#petsRow');
    //   var petTemplate = $('#petTemplate');

    //   for (i = 0; i < data.length; i ++) {
    //     petTemplate.find('.panel-title').text(data[i].name);
    //     petTemplate.find('img').attr('src', data[i].picture);
    //     petTemplate.find('.pet-breed').text(data[i].breed);
    //     petTemplate.find('.pet-age').text(data[i].age);
    //     petTemplate.find('.pet-location').text(data[i].location);
    //     petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

    //     petsRow.append(petTemplate.html());
    //   }
    // });

    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }
    else {
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Sale.json", function (sale) {
      App.contracts.Sale = TruffleContract(sale);
      App.contracts.Sale.setProvider(App.web3Provider);

      return App.render();
    });
    /*
     * Replace me...
     */
  },

  render: function () {
     const ipfs = window.IpfsApi({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https'
      });
    var saleInstance;
    var loader = $("#loader");
    var content = $("#content");
    loader.show();
    content.hide();

    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
    App.contracts.Sale.deployed().then(function (instance) {
      saleInstance = instance;
      
      return saleInstance.salesCount();

    }).then(function (salesCount) {

      var saleList = $("#saleList");
      saleList.empty();

      var salesSelect = $("#salesSelect");
      salesSelect.empty();


      for (var i = 0; i <= salesCount; i++) {
        saleInstance.sales(i).then(function (sale) {
         // var hashTransaction = coconutInstance.TxHash;
          var id = sale[0];
          var name = sale[1];
          var category = sale[2];
          var price = sale[3];
          var phone = sale[4];
          var cid = sale[5];


          ipfs.dag.get(cid,(err,result)=>{
          if(err){
            console.error('error: ' + err);
          }
          data = result.value;
          var img;
          if(data.category=='cap1'){
            img=1;
          }
          if(data.category=='cap2'){
            img=2;
          }
          if(data.category=='cap3'){
            img=3;
          }
          if(data.category=='cap4'){
            img=4;
          }
         var saleTemplate =' <div class="block">\
                          <div class="icon-home"><img src="/img/'+img+'.png"/></div>\
                          <div class="content-tab-content">\
                              <div class="rows">\
                                <span class="title_">Chủ sở hữu:</span> <span class="content_">'+name+'</span>\
                            </div>\
                            <div class="rows">\
                                <span class="title_">Ngày tạo:</span> <span>'+data.created_at+'</span>\
                            </div><div class="rows">\
                                <span class="title_">CODE:</span> <span>'+cid+'</span>\
                            </div>\
                          </div>\
                        </div>' ;
         // console.log(data);
          saleList.append(saleTemplate);
         }) 

          
          // if (name && cocoType && productionDate !== "Invalid Date") {
           
          //}
        });
      }
      loader.hide();
      content.show();
    }).catch(function (error) {
      console.warn(error);
    })
  },
  searchCoco: function() {
    var coconutList = $("#coconutList");
    coconutList.empty();
    var self = this;
    var searchString = $("#search-input").val();
    web3.eth.getTransaction(searchString, function(error, result) { 
      if(error) {
        console.error(error);
      } else {
        var arrayInput = [];
        var hashInput = result.input.slice(10);
        console.log(result);
        hashInput = App.reverseString(hashInput);
        while (hashInput.length > 0) {
          var temp = hashInput.slice(0, 64);
          temp = App.reverseString(temp);
          arrayInput.push(temp);
          var newInput = hashInput.slice(64);
          hashInput = newInput;
        }
        console.log(arrayInput[0],arrayInput[1]);
        var ipfsString = web3.toUtf8("0x" + arrayInput[1]) + web3.toUtf8("0x" + arrayInput[0]);
        console.log(ipfsString);
        App.ipfs.catJSON(ipfsString, (err, result) => { // lấy nội dung
          if(err) {
            console.error(err);
            return
          }
        console.log(result);
          var name = result.name;
          var cocoType = result.cocoType;
          var productionDate = new Date(result.productionDate).toLocaleDateString();
          var expireDate = new Date(result.expireDate).toLocaleDateString();
          var weight = result.weight;
          var id = "";
          var coconutTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + cocoType + "</td><td>" + productionDate + "</td><td>" + expireDate + "</td><td>" + weight + "</td></tr>";
            if (name && cocoType && productionDate !== "Invalid Date") {
              coconutList.append(coconutTemplate);
          }
        });
      }
    });
  },
  search: function () {
    const ipfs = window.IpfsApi({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https'
      });
    var saleInstance;
    var loader = $("#loader");
    var content = $("#content");
    var searchString = $('#search').val();
    var flag = 0;
    loader.show();
    content.hide();

    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
    App.contracts.Sale.deployed().then(function (instance) {
      saleInstance = instance;
      
      return saleInstance.salesCount();

    }).then(function (salesCount) {

      var saleList = $("#saleVertify");
      saleList.empty();

      var salesSelect = $("#salesSelect");
      salesSelect.empty();


      for (var i = 0; i <= salesCount; i++) {
        saleInstance.sales(i).then(function (sale) {
         // var hashTransaction = coconutInstance.TxHash;
          var id = sale[0];
          var name = sale[1];
          var category = sale[2];
          var price = sale[3];
          var phone = sale[4];
          var cid = sale[5];


          ipfs.dag.get(cid,(err,result)=>{
          if(err){
            console.error('error: ' + err);
          }
          data = result.value;
          var img;
          if(data.category=='cap1'){
            img=1;
          }
          if(data.category=='cap2'){
            img=2;
          }
          if(data.category=='cap3'){
            img=3;
          }
          if(data.category=='cap4'){
            img=4;
          }
         var saleTemplate =' <div class="block check_vertify">\
                          <div class="icon-home"><img src="/img/'+img+'.png"/></div>\
                          <div class="content-tab-content">\
                              <div class="rows">\
                                <span class="title_">Chủ sở hữu:</span> <span class="content_">'+name+'</span>\
                            </div>\
                            <div class="rows">\
                                <span class="title_">Ngày tạo:</span> <span>'+data.created_at+'</span>\
                            </div><div class="rows">\
                                <span class="title_">CODE:</span> <span>'+cid+'</span>\
                            </div>\
                          </div>\
                        </div>' ;
         // console.log(data);
          if(cid == searchString){
            saleList.append(saleTemplate);
              $('.notify-success').css('display','block');
              $('.notify-success').text('Thông tin đã xác thực!');
              $('.notify-fail').css('display','none');
              return false;
             }
         
         }) 

          // if (name && cocoType && productionDate !== "Invalid Date") {
           
          //}
        });
      }

      var check = $('.check_vertify').length;
      console.log(check);
      if(check==0){
        $('.notify-success').css('display','none');
         $('.notify-fail').css('display','block');
           $('.notify-fail').text('Thông tin không tìm thấy!');
           
            
      }

      loader.hide();
      content.show();
    }).catch(function (error) {
      
      console.warn(error);
    })
  },
  addSale: function () {
    var loader = $("#loader");
    var content = $("#content");

    var name = $("#name").val();
    var phone = $("#phone").val();
    var category =  $("#category").val();
    var price = $("#price").val();
    var discription = $("#discription").val();
    var created_at = $("#created_at").val();



    const ipfs = window.IpfsApi({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https'
      });

// console.log(ipfs);
    var obj = {
            name: name,
            phone: phone,
            category: category,
            price: price,
            discription:discription,
            created_at:created_at
          };

      let cid;
     ipfs.dag.put(obj,(err,cid)=>{
      if(err){
        console.error('error: ' + err);
      }
      console.log(cid.toBaseEncodedString());
      cid = cid.toBaseEncodedString();

     //  ipfs.dag.get(cid,(err,result)=>{
     //  if(err){
     //    console.error('error: ' + err);
     //  }
     //  console.log(result.value);
     // }) 

      App.contracts.Sale.deployed().then(function (instance) {
      content.hide();
      $('#text-load').text('Đang lưu vào blockchain...');
      loader.show();
      return instance.addSale(name, category, price, phone, cid);
        }).then(function (result) {
          console.log(result);
          location.href = "index.html";
          alert('Thành công !');
        }).catch(function (err) {
          console.error(err);
        });

     }) 

     
    
  },
  bindEvents: function () {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function (adopters, account) {
    /*
     * Replace me...
     */
  },

  handleAdopt: function (event) {
    event.preventDefault();
    /*
     * Replace me...
     */
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
