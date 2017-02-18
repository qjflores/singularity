var Course = artifacts.require('./Course.sol');
var User = artifacts.require('./User.sol');
var Teacher = artifacts.require('./Teacher.sol');

contract("Course", function(accounts){
  var teacher;
  var course;
  var _owner;
  var user;
  var student;
  var generalUser = accounts[3]
  var studentUser = accounts[4]
  it('user-student-init', function(){
    return User.new("StudentUser", {from:studentUser})
      .then(function(userContract){
        if (userContract.address) {
          student = userContract;
        } else {
          throw new Error("no contract address");
        }
        return true
      })
  })
  it('user-init', function(){
    return User.new("GeneralUser", {from:generalUser})
      .then(function(userContract){
        if (userContract.address) {
          user = userContract;
        } else {
          throw new Error("no contract address");
        }
        return true
      })
  })
  it('teacher-init', function(){
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
  it('course-init', function(){
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
      })
  })
  it('course-register-student',function(){
    return course.getStudentCount()
      .then(function(studentCount){
        assert.equal(studentCount, 0)
        return course.registerStudent(student.address,{from:studentUser})
      })
      .then(function(txHash){
        return course.getStudentCount()
      })
      .then(function(studentCount){
        assert.equal(studentCount, 1)
        return student.services(course.address)
      })
      .then(function(serviceInfo){
        assert.equal(serviceInfo[2].toString(), web3.toWei(10, "ether"))
      })
  })
})