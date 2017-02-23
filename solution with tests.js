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
        throw Error(`Number must be between ${min} and ${max}.`);
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
    },
    isBooklikeObject(input){
      if(!(input instanceof Book)){
        throw Error('Input is not book-like object.')
      }
    },
    isMedialikeObject(input){
      if(!(input instanceof Media)){
        throw Error('Input is not media-like object.')
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
      if(itemsInput.length === 1){
        itemsInput = itemsInput[0];
      }

      Validators.inputIsUndefined(itemsInput[0]);
      
      for(var item of itemsInput){
        Validators.isItemlikeObject(item);
      }
      
      this.items.push(...itemsInput);
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
  
  class BookCatalogue extends Catalogue{
    constructor(name){
      super(name, id);
      this.items = [];
    }
    add(...booksInput){

      if(booksInput.length === 1){
        booksInput = booksInput[0];
      }
      
      for(var item of booksInput){
        Validators.isBooklikeObject(item);
      }
      return super.add(...booksInput);
    }
    getGenres(){
      var genres = [];
      
      for(var item of this.items){
        var matchingGenre = item.genre.toLowerCase();
        if(genres.indexOf(matchingGenre) === -1){
          genres.push(matchingGenre);
        }
      }
      return genres;
    }
    find(query){
         
      var genre = query.genre;
      
      var result;
      
      if(genre === undefined){
        result = super.find(query);
      }
      else{
        if(keys(query).length !== 1){
          var queryWithoutGenre = Object.create(query);
        
          for(var k = 0; k < keys(query).length; k++){
            queryWithoutGenre[keys(query)[k]] = query[keys(query)[k]];
          }
          
          delete queryWithoutGenre["genre"];
          
          var filteredWithoutGenre = super.find(queryWithoutGenre);
          
          result = filteredWithoutGenre.filter(item => item.genre === genre);
        }
        else{
          result = this.items.filter(item => item.genre === genre);
        }
      }
      return result;
    }
  }
  
  class MediaCatalogue extends Catalogue{
    construtor(name){

      this.items = [];
    }
    add(...mediaInput){
      
      if(mediaInput.length === 1){
        mediaInput = mediaInput[0];
      }
      
      for(var media of mediaInput){
        Validators.isMedialikeObject(media);
      }
      
      return super.add(...mediaInput);
    }
    getTop(count){
      var result = [];
      
      Validators.isNumber(count);
      Validators.numberMustBeBetween(count, 1, Infinity);
      
      result = this.items.sort(function(a, b){return a.rating < b.rating});
      
      var topResult = [];
      
      if(count <= result.length){
        for(var i = 0; i < count; i++)
        {
          topResult[i] = result[i];
        }
      }
      else{
        for(var i = 0; i < result.length; i++)
        {
          topResult[i] = result[i];
        }
      } 
      return topResult;
    }
    getSortedByDuration(){
      var result = [];
      
      result = this.items.sort(function(a, b){
        if(a.duration !== b.duration){
          return a.duration < b.duration;
        }
        else{
          return a.id > b.id;
        }
      });
      return result;
    }
    find(query){
      var rating = query.rating;
      
      var result;
      
      if(rating === undefined){
        result = super.find(query);
      }
      else{
        if(keys(query).length !== 1){
          var queryWithoutRating = Object.create(query);
          
          for(var k = 0; k < keys(query).length; k++){
            queryWithoutRating[keys(query)[k]] = query[keys(query)[k]];
          }
          
          delete queryWithoutRating["rating"];
          
          var filteredWithoutRating = super.find(queryWithoutRating);
          
          result = filteredWithoutRating.filter(item => item.rating === rating);
        }
        else{
          result = this.items.filter(item => item.rating === rating);
        }
      }
      return result;
    }
  }

  var item1 = new Item("item1 description", "item1");
  console.log(item1);
  
  var book1 = new Book("A gory book", "Gore", "2233445566", "Horror");
  var book2 = new Book("A gory book", "Gore", "2233445566", "horror");
  var book3 = new Book("A gory book", "Gore", "2233445566", "Fantasy");
  console.log(book1);
  
  var media1 = new Media("Media descrition", "Media1", 10001, 1);
  var media2 = new Media("Media descrition", "Media2", 10004, 2);
  var media3 = new Media("Media descrition", "Media3", 10001, 3);
  var media4 = new Media("Media descrition", "Media4", 10002, 3);
  console.log(media1);
  
  var cata1 = new Catalogue("Catalogue One");
  console.log(cata1);
  
  cata1.add(book1, media1);
  console.log(cata1.items);

  cata1.add([book1, media1, book2]);
  console.log(cata1.items);
  

  
  console.log(cata1.find({id: 2, name:'Gore'}));
  
  console.log(cata1.search('A'));

  var bookCata = new BookCatalogue("Fantasy");
  console.log(bookCata);
  console.log(book2);
  
  bookCata.add(book1, book2, book3);
  
  console.log(bookCata.items);
  
  
  console.log(bookCata.getGenres());

  console.log(bookCata.find({genre: "Fantasy"}));
  
  var mediaCata = new MediaCatalogue("MediaCatalogue");
  
  console.log(mediaCata);
  
  mediaCata.add(media1, media2, media3, media4);
  
  console.log(mediaCata.items);
  
  console.log(mediaCata.getTop(5));
  
  console.log(mediaCata.getSortedByDuration());
  
  console.log(mediaCata.find({id: 8, rating: 3}));
  

  return {
    getBook: function (name, isbn, genre, description){
      return new Book(name, isbn, genre, description)
    },
    getMedia: function (name, rating, duration, description){
      return new Media(name, rating, duration, description);
    },
    getBookCatalog: function (name){
      return new BookCatalogue(name);
    },
    getMediaCatalogue: function(name){
      return new MediaCatalogue(name);
    }
  }
}

solve();
