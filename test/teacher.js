var User = artifacts.require('./User.sol');
var Teacher = artifacts.require('./Teacher.sol');
var Course = artifacts.require('./Course.sol');

contract("Teacher", function(accounts) {
  var teacher;
  var course;
  var _owner;
  var user;
  var generalUser = accounts[3]
  it('teacher-init', function(){
    return User.new("GeneralUser", {from:generalUser})
      .then(function(userContract){
        if (userContract.address) {
          user = userContract;
        } else {
          throw new Error("no contract address");
        }
        return true
      })
      .then(function(value){
        return Teacher.new(user.address,{from:generalUser})
          .then(function(teacherContract){
            if (teacherContract.address){
              teacher = teacherContract;
            } else {
              throw new Error("no contract address");
            }
            return true
          })
      })
      .then(function(txHash){
        return teacher.getCourseCount()
      })
      .then(function(courseCount){
        assert.equal(courseCount.toString(), 0);
      })
    })
    it('teacher-create-course', function(){
      var courseName = "Beginning Yoga Class";
      var courseDescription = "Beginning Yoga Class Description";
      var rate = web3.toWei(10, "ether");
      return teacher.createCourse(courseName, courseDescription, rate)
        .then(function(txHash){
          return teacher.getCourseCount()
        })
        .then(function(courseCount){
          assert.equal(courseCount.toString(), 1);
        })
        .then(function(txHash){
          return teacher.courses(0);
        })
        .then(function(courseAddress){
          return Course.at(courseAddress);
        })
        .then(function(courseContract){
          course = courseContract;
          return course.providerName()
        })
        .then(function(courseName){
          assert.equal(courseName, "Beginning Yoga Class");
          return course.teacher()
        })
        .then(function(teacherAddress){
          assert.equal(teacherAddress, teacher.address);
          return course.rate()
        })
        .then(function(courseRate){
          assert.equal(courseRate, rate);
        })

    })
    it('teacher-update-course-rate', function(){
      var newRate = web3.toWei(20, "ether");
      return teacher.updateCourseRate(course.address, newRate)
        .then(function(txHash){
          return course.rate()
        })
        .then(function(courseRate){
          assert.equal(courseRate, newRate);
        })
    })
})