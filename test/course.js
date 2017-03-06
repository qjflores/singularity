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
  it('user-student-init', async function(){
    student = await User.new("StudentUser", {from:studentUser});
    if(!student.address)
      throw new Error("no contract address");
  })
  it('user-init', async function(){
    user = await User.new("GeneralUser", {from:generalUser})
    if(!user.address)
      throw new Error("no contract address");
  })
  it('teacher-init', async function(){
    teacher = await Teacher.new(user.address,{from:generalUser})
    if(!teacher.address)
      throw new Error("no contract address");
  })
  it('course-init', async function(){
    var courseName = "Beginning Yoga Class";
    var courseDescription = "Beginning Yoga Class Description";
    var rate = web3.toWei(10, "ether");
    await teacher.createCourse(courseName, courseDescription, rate)
    let courseCount = await teacher.getCourseCount();
    assert.equal(courseCount.toString(), 1);
    let courseAddress = await teacher.courses(0);
    course = await Course.at(courseAddress);
  })
  it('course-register-student', async function(){
    let studentCount = await course.getStudentCount();
    assert.equal(studentCount, 0);
    await course.registerStudent(student.address,{from:studentUser});
    studentCount = await course.getStudentCount();
    assert.equal(studentCount, 1);
    let serviceInfo = await student.services(course.address);
    assert.equal(serviceInfo[2].toString(), web3.toWei(10, "ether"));
  })
})
