export enum Semester {
  first,
  second,
  third
}

export enum faculy {
  สถาบันภาษาไทยสิรินธร = 1,
  ศูนย์การศึกษาทั่วไป = 2,
  บัณฑิตวิทยาลัย = 20,
  คณะวิศวกรรมศาสตร์ = 21,
  คณะอักษรศาสตร์ = 22,
  คณะวิทยาศาสตร์ = 23,
  คณะรัฐศาสตร์ = 24,
  คณะสถาปัตยกรรมศาสตร์ = 25,
  คณะพาณิชยศาสตร์และการบัญชี = 26,
  คณะครุศาสตร์ = 27,
  คณะนิเทศศาสตร์ = 28,
  คณะเศรษฐศาสตร์ = 29,
  คณะแพทยศาสตร์ = 30,
  คณะสัตวแพทยศาสตร์ = 31,
  คณะทันตแพทยศาสตร์ = 32,
  คณะเภสัชศาสตร์ = 33,
  คณะนิติศาสตร์ = 34,
  คณะศิลปกรรมศาสตร์ = 35,
  คณะพยาบาลศาสตร์ = 36,
  คณะสหเวชศาสตร์ = 37,
  คณะจิตวิทยา = 38,
  คณะวิทยาศาสตร์การกีฬา = 39,
  สำนักวิชาทรัพยากรการเกษตร = 40,
  วิทยาลัยประชากรศาสตร์ = 50,
  วิทยาลัยวิทยาศาสตร์สาธารณสุข = 53,
  สถาบันภาษา = 55,
  สถาบันนวัตกรรมบูรณาการแห่งจุฬาลงกรณ์มหาวิทยาลัย = 56,
  สถาบันบัณฑิตบริหารธุรกิจศศินทร์ฯ = 68
}

export enum Role {
  admin,
  student
}

export enum StudentType {
  semester,
  trisemester,
  international
}

export enum Degree {
  year1,
  year2,
  year3,
  year4,
  year5,
  year6,
  master,
  doctoral,
  other
}

export enum RequiredDegree {
  bachelor,
  master,
  doctoral,
  other
}

export enum Grade {
  A,
  B,
  C,
  D,
  S,
  U,
  F,
  W,
  M,
}

export enum CourseUserStatus {
  ungraded,
  graded
}
