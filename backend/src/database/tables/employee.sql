create DATABASE Employee_management
use Employee_management
create table Employees(
    employee_id VARCHAR(100) not null,
    name VARCHAR (250) not null,
    email VARCHAR(300) not null UNIQUE,
    phone_no VARCHAR(20) not null UNIQUE,
    id_no int not null UNIQUE,
    password varchar(200) not null,
    role varchar(20) DEFAULT 'employee',
    welcome bit DEFAULT 0
)
select * from Employees
SELECT * FROM Employees WHERE welcome = 0
delete from Employees where id_no = 1234545
drop table Employees








