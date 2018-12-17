pragma solidity ^0.4.24;

contract Sale {
    struct SaleEntity{
        uint id;
        string name;
        string category;
        uint price;
        string phone;
        string cid;
    }

    mapping(uint => SaleEntity) public sales;

    uint public salesCount;

    constructor() public {
        salesCount = 0;
    }
    function addSale(string _name, string _category, uint _price, string _phone, string _cid) public{
        sales[salesCount] = SaleEntity(salesCount, _name, _category, _price, _phone,_cid);
        salesCount++;
    }
}
