/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Ctrl+R),
 * 2. Inspect to bring up an Object Inspector on the result (Ctrl+I), or,
 * 3. Display to insert the result in a comment after the selection. (Ctrl+L)
 */
"use strict"

function solve(){
  
  var id = 0;
  
  function idGenerator(){
    id += 1;
    return id;
  }
  
  const Validators = {
    stringNonEmpty(inputString){
      if(inputString){
        return inputString;
      }
      else{
        throw Error('String can`t be empty');
      }
    },
    stringMustBeBetween(inputString, min, max){
      if(inputString.length < min || inputString.length > max){
        throw Error(`String must be between ${min} and ${max} characters long.`);
      }
      else{
        return inputString;
      }
    },
    stringContainsOnlyDigits(inputString){
      var onlyDigits = true;
      for(var i = 0; i < inputString.length; i++){
        if(isNaN(inputString[i])){
          onlyDigits = false;
        }
      }
      if(onlyDigits){
        return inputString;
      }
      else{
        throw Error('String can contain only digits.');
      }
    },
    stringIsNumber(inputString){
      if(isNaN(inputString)){
        throw Error('String must be number.');   
      }
      else{
        return true
      }
    },
    numberMustBeBetween(inputString, min, max){
      if(inputString < min || inputString > max){
        throw Error(`Number must be between ${min} and ${max} characters long.`);
      }
    },
    inputIsUndefined(input){
      if(input === undefined){
        throw Error('No arguments passed to the function');
      }
    },
    arrayIsEmpty(input){
      if(input.length === 0){
        throw Error('Array can`t be empty.');
      }
    },
    isItemlikeObject(input){
      if(!(input instanceof Item)){
        throw Error('Input is not item-like object.')
      }
    },
    isNumber(input){
      if(typeof input !== 'number'){
        throw Error('Input must be a number.');
      }
    }
  }
  
  
  
  class Item{
    constructor(description, name){
      this.id = idGenerator();
      this.description = description;
      this.name = name;
    }
    
    get description(){
      return this._description;
    }
    set description(value){
      Validators.stringNonEmpty(value);
      this._description = value;
    }
    get name(){
      return this._name;
    }
    set name(value){
      Validators.stringMustBeBetween(value, 2, 40);
      this._name = value;
    }
  }
  
  class Book extends Item{
    constructor(description, name, isbn, genre){
      super(description, name);
      this.isbn = isbn;
      this.genre = genre;
    }
    get isbn(){
      return this._isbn
    }
    set isbn(value){

      Validators.stringContainsOnlyDigits(value);
      Validators.stringMustBeBetween(value, 10, 13);
      this._isbn = value;
    }
    get genre(){
      return this._genre;
    }
    set genre(value){
      Validators.stringMustBeBetween(value, 2, 20);
      this._genre = value;
    }
  }
  
  class Media extends Item{
    constructor(description, name, duration, rating){
      super(description, name);
      this.duration = duration;
      this.rating = rating;
    }
    get duration(){
      return this._duration;
    }
    set duration(value){
      Validators.numberMustBeBetween(value, 0, Infinity);
      this._duration = value;
    }
    get rating(){
      return this._rating;
    }
    set rating(value){
      Validators.numberMustBeBetween(value, 1, 5)
      this._rating = value;
    }
  }
  
  class Catalogue {
    
    constructor(name){
      this.id = idGenerator();
      this.name = name;
      this.items = [];
    }
    get name(){
      return this._name;
    }
    set name(value){
      Validators.stringMustBeBetween(value, 2, 40);
      this._name = value;
    }
    add(...itemsInput){
      Validators.inputIsUndefined(...itemsInput);
      for(var item of itemsInput){
        Validators.isItemlikeObject(item);
        this.items.push(item);
      }
      return this;
    }
    add(itemsInput){
      Validators.arrayIsEmpty(itemsInput);
      for(var i = 0; i < itemsInput.length; i++){
        Validators.isItemlikeObject(itemsInput[i]);
        this.items.push(itemsInput[i]);
      }
      return this;
    }
    find(id){
      Validators.inputIsUndefined(id);
      Validators.isNumber(id);
      var matchingItem = this.items.find(item => item.id === id);
      if(matchingItem === undefined){
        return null;
      }
      else{
        return matchingItem;
      }
    }
    find(query){
      var result;
      
      var id = query.id;
      var name = query.name;

      var queryParameters = keys(query).length;
      
      if(queryParameters === 1){
        result = this.items.filter(item => item.id === id || item.name === name);
      }
      else{
        result = this.items.filter(item => item.id === id && item.name === name);
      }
      
      return result;
    }
    search(pattern){
      var result = [];
      
      Validators.stringMustBeBetween(pattern, 1, Infinity);
      
      for(var i = 0; i < this.items.length; i++){
        if(this.items[i].name.indexOf(pattern) !== -1 || this.items[i].description.indexOf(pattern) !== -1){
          result.push(this.items[i]);
        }
      }
      return result;
    }
    
    
  }
  
  var item1 = new Item("item1 description", "item1");
  console.log(item1);
  
  var book1 = new Book("A gory book", "Gore", "2233445566", "Horror");
  var book2 = new Book("A gory book", "Gore", "2233445566", "Horror");
  console.log(book1);
  
  var media1 = new Media("Media descrition", "Media1", 10000, 4);
  console.log(media1);
  
  var cata1 = new Catalogue("Catalogue One");
  console.log(cata1);
  
  cata1.add(book1, media1);
  console.log(cata1.items);
  
  //var arr = [book1, media1];
  //console.log(arr);
  cata1.add([book1, media1, book2]);
  console.log(cata1.items);
  
  //console.log(cata1.find(2))
  
  //console.log(cata1.find("3"));
  
  console.log(cata1.find({id: 2, name:'Gore'}));
  
  console.log(cata1.search('A'));
  
  //cata1.add();
  
  return {
    getBook: function (name, isbn, genre, description){
      return new Book(name, isbn, genre, description)
    },
    getMedia: function (name, rating, duration, description){
      return new Media(name, rating, duration, description);
    },
    getBookCatalog: function (name){
      return new BookCatalog(name);
    },
    getMediaCatalogue: function(name){
      return new MediaCatalogue(name);
    }
  }
}

solve();
