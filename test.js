let assert = require("chai").assert;

let expect = require("chai").expect;

let should = require("chai").expect;

var thing = require("./index");

//below here are mock functions for testing

function mockclientinfo(result) {
  if (result.length <= 0) {
    return "redirect1"
  } else { // Send Accounts table
    return "redirect2"
  }
}

function mockcompleteprof(logged) {

  if (logged)
  {
    return "redirectprof";
  }
  else
  {
    return "redirectlogin";
  }
}

function mockadduser(results, user, pass) {
    if (user && pass) {
        //User Doesn't Exist
        if (results.length <= 0){
          return "adduser";
        } else {
          return "already exists";
        }
    } else {
      return "redirecttolanding";
    }
}

function mockeditprof(username, results, fullName, ncity) {

    if (username.length > 0 && fullName.length > 0 && ncity.length > 0) {
        if (results.length > 0) {
          return "editdb";
        } else{
          return "addnew";
        }
    }
    else {
      return "formnotfilled";
  }
}

function mocklogin(results1, results2) {
  let r = "";
  if (results1.length > 0) {
   r = "logged "
  }
  else {
    return "redirectlanding "
  }
  if (results2.length > 0) {
   r += "tofuel"
  }
  else {
    r += "tocompleteprof"
  }
  return r;
}


function mocklogout(logged) {
  if(logged) {
    return false;
  } else {
    return true;
  }
}
//end mock functions


describe("mocklogin()", function() {
  it("should log user in to profile", function() {
    isLogin = mocklogin("hi", "");
    assert.equal(isLogin, "logged tocompleteprof");
  })
  it("should log user in to fuel", function() {
    isLogin = mocklogin("hi", "hi");
    assert.equal(isLogin, "logged tofuel");
  })
  it("should redirect to sign in", function() {
    isLogin = mocklogin("", "hi");
    assert.equal(isLogin, "redirectlanding ");
  })
});

describe("mocklogout()", function() {
  it("should log out", function() {
    isLogout = mocklogout(true);
    assert.equal(isLogout, false);
  })
  it("should already be", function() {
    isLogout = mocklogout(false)
    assert.equal(isLogout, true);
  })
});

describe("mockadduser()", function() {
  it("should adduser", function() {
    add = mockadduser("", "hi", "hi");
    assert.equal(add, "adduser");
  })
  it("should alreadyexist", function() {
    add = mockadduser("hi", "hi", "hi");
    assert.equal(add, "already exists");
  })
  it("should redirect", function() {
    add = mockadduser("hi", "", "");
    assert.equal(add, "redirecttolanding");
  })
});

describe("mockeditprof()", function() {
  it("should add", function() {
    edit = mockeditprof("hi", "", "hi", "hi");
    assert.equal(edit, "addnew");
  })
  it("should edit", function() {
    edit = mockeditprof("hi", "hi", "hi", "hi");
    assert.equal(edit, "editdb");
  })
  it("should redirect", function() {
    edit = mockeditprof("", "", "", "");
    assert.equal(edit, "formnotfilled");
  })
});

describe("mockclientinfo()", function() {
  it("should log user in to profile", function() {
    cl = mockclientinfo("hi");
    assert.equal(cl, "redirect2");
  })
  it("should log user in to fuel", function() {
    cl = mockclientinfo("");
    assert.equal(cl, "redirect1");
  })
});

describe("mockcompleteprof()", function() {
  it("should log user in to profile", function() {
    comp = mockcompleteprof(true);
    assert.equal(comp, "redirectprof");
  })
  it("should log user in to fuel", function() {
    comp = mockcompleteprof(false);
    assert.equal(comp, "redirectlogin");
  })
});
