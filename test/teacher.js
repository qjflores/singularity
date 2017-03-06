var User = artifacts.require('./User.sol');
var Teacher = artifacts.require('./Teacher.sol');
var Course = artifacts.require('./Course.sol');

contract("Teacher", function(accounts) {
  var teacher;
  var course;
  var _owner;
  var user;
  var generalUser = accounts[3]
  it('teacher-init', async function(){
    user = await User.new("GeneralUser", {from:generalUser});
    if (!user.address)
      throw new Error("no contract address");

    teacher = await Teacher.new(user.address,{from:generalUser});
    if (!teacher.address)
      throw new Error("no contract address");
      
    let courseCount = await teacher.getCourseCount();
    assert.equal(courseCount.toString(), 0);
  })
  it('teacher-create-course', async function(){
      var courseName = "Beginning Yoga Class";
      var courseDescription = "Beginning Yoga Class Description";
      var rate = web3.toWei(10, "ether");

      await teacher.createCourse(courseName, courseDescription, rate)
      let courseCount = await teacher.getCourseCount();
      assert.equal(courseCount.toString(), 1);

      let courseAddress = await teacher.courses(0);
      course = await Course.at(courseAddress);
      let name = await course.providerName();
      assert.equal(name, courseName);

      let teacherAddress = await course.teacher();
      assert.equal(teacherAddress, teacher.address);

      let courseRate = await course.rate();
      assert.equal(courseRate, rate);
    })
    it('teacher-update-course-rate', async function(){
      var newRate = web3.toWei(20, "ether");
      await teacher.updateCourseRate(course.address, newRate);
      let courseRate = await course.rate();
      assert.equal(courseRate, newRate);
    })
})
