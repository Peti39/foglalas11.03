import { Controller, Get, Post, Render, Body, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import path from "path";
import fs from "fs"
import type { Response } from 'express';

class NewBookingDto{
    name : string;
    email : string;
    date: string;
    groupNumber : string;
}




@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return { message: this.appService.getHello(), errors : [], dto : {} };
  }

  @Post("/submit")
  //@Render("index")
  newBooking(@Body() newBookingDto : NewBookingDto, @Res() res : Response){
    const errors : string[] = []
    const emailregex = /^\S+@\S+$/
    //Name
    console.log(newBookingDto)
    if(newBookingDto.name.trim() == ""){
      errors.push("Must give a name")
    }

    //Email
    if(newBookingDto.email.trim() == ""){
      errors.push("Must give an email")
    }
    if(!emailregex.test(newBookingDto.email)){
      errors.push("Email must be valid")
    }

    //Date
    const dateNow = new Date()
    const dateInput = new Date(newBookingDto.date)
    if(newBookingDto.date.trim() == ""){
      errors.push("Must pick a date")
    }else if(dateInput < dateNow){
      errors.push("Date must be in the future")
    }

    //GroupNumber
    const groupNumber = parseInt(newBookingDto.groupNumber)
    if(isNaN(groupNumber)){
      errors.push("Group number must be a number")
    }else if(groupNumber < 1 || groupNumber > 10){
      errors.push("Group number must be in the 1-10 range")
    }

    if(errors.length == 0){
      //TODO: Uploud to DB
      const filePath = path.join(__dirname, '..', 'reservation.csv');
 
      const header = 'name;email;date;groupNumber\n';
      const line = `${newBookingDto.name};${newBookingDto.email};${newBookingDto.date};${newBookingDto.groupNumber}\n`;
 
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, header + line, 'utf-8');
      } else {
        fs.appendFileSync(filePath, line, 'utf-8');
      }
      res.redirect('/succes')
    }else{
      console.log("Test01")
      console.log(errors)
      res.status(HttpStatus.BAD_REQUEST).render('index', {dto : newBookingDto, errors : errors}) 
    }
  }

  @Get("/succes")
  @Render("succes")
  succesfulBooking(){
    return
  }



  
}
