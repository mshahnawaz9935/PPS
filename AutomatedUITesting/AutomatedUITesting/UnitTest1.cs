using System;
using System.Threading;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace AutomatedUITesting
{
  [TestClass]
  public class UnitTest1
  {
    [TestMethod]
    public void AddEmployee()
    {
      using (IWebDriver driver = new ChromeDriver("C:\\"))
      {
        driver.Manage().Window.Maximize();
        var url = "http://localhost:4200";
        driver.Url = url;
        driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);

        // Click the employee button
        driver.FindElement(By.Id("addEmployee")).Click();
        Thread.Sleep(2000);

        WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
        wait.Until(ExpectedConditions.VisibilityOfAllElementsLocatedBy(
           By.Id("dob")));

        driver.FindElement(By.Id("dob")).SendKeys("20/07/1965");

        driver.FindElement(By.Id("firstName")).SendKeys(Faker.Name.First());

        driver.FindElement(By.Id("lastName")).SendKeys(Faker.Name.Last());

        driver.FindElement(By.Id("region")).SendKeys(Faker.Address.City());

        driver.FindElement(By.Id("speciality")).SendKeys("Developer");

        driver.FindElement(By.Id("email")).SendKeys(Faker.Internet.Email());

        SelectElement select = new SelectElement(driver.FindElement(By.Id("departmentId")));

        Random r = new Random();
        int random = r.Next(0, 2); // random number to select index

        select.SelectByIndex(random);

        driver.FindElement(By.Id("submit")).Click();

        var status = driver.FindElement(By.Id("results")).Text;

        Assert.IsTrue(status.Contains("Successfully"));

        Thread.Sleep(5000);
      }
    }

    [TestMethod]
    public void EditEmployeeDepartment()
    {
      using (IWebDriver driver = new ChromeDriver("C:\\"))
      {
        driver.Manage().Window.Maximize();
        var url = "http://localhost:4200";
        driver.Url = url;
        driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);


        Thread.Sleep(2000);

        driver.FindElement(By.XPath("//*[@id='cdk-drop-list-1']/table/tr[3]/td[6]/span[2]")).Click();
        Thread.Sleep(2000);

        WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
        wait.Until(ExpectedConditions.VisibilityOfAllElementsLocatedBy(
           By.Id("dob")));

        driver.FindElement(By.Id("dob")).SendKeys("20/07/1965");

  
        driver.FindElement(By.Id("email")).SendKeys(Faker.Internet.Email());

        SelectElement select = new SelectElement(driver.FindElement(By.Id("departmentId")));

        Random r = new Random();
        int random = r.Next(0, 2); // random number to select index

        select.SelectByIndex(random);

        driver.FindElement(By.Id("submit")).Click();

        var status = driver.FindElement(By.Id("results")).Text;

        Assert.IsTrue(status.Contains("Successfully"));

        Thread.Sleep(5000);
      }
    }

    [TestMethod]
    public void DeleteEmployee()
    {
      using (IWebDriver driver = new ChromeDriver("C:\\"))
      {
        driver.Manage().Window.Maximize();
        var url = "http://localhost:4200";
        driver.Url = url;
        driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
        Thread.Sleep(2000);

        driver.FindElement(By.XPath("//*[@id='cdk-drop-list-1']/table/tr[5]/td[6]/span[3]")).Click();

        WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
        wait.Until(ExpectedConditions.VisibilityOfAllElementsLocatedBy(
           By.Id("results")));

        var status = driver.FindElement(By.Id("results")).Text;

        Assert.IsTrue(status.Contains("Deleted"));

      }
    }


  }
}

