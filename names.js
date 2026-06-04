/**
 * Night Owl — Indian Name Dictionary
 * Used by censor.js to detect and mask names in chat messages.
 * Names are stored lowercase for case-insensitive matching.
 */

export const FIRST_NAMES = new Set([
  // ── Male Hindu names ──
  'aarav','aadi','aadit','aadith','aaditya','aahan','aakash','aanand','aarjav','aaron',
  'aarush','aatish','aayush','abhay','abhi','abhijit','abhijeet','abhilash','abhimanyu','abhinav',
  'abhinandan','abhiram','abhishek','achyut','adarsh','adev','adhrit','aditya','advik','agastya',
  'ahaan','ajay','ajit','ajith','akash','akhil','akhilesh','akshay','akshat','akul',
  'alok','aman','amar','amay','ambar','amish','amit','amitabh','amol','amrit',
  'anand','ananth','anay','angad','aniket','anil','animesh','anirudh','aniruddh','anish',
  'anjaneya','ankit','ankur','anoop','ansh','anshu','anshul','anshuman','anuj','anurag',
  'apoorv','appaji','arhan','arhaan','arihant','arijit','arjun','arnav','arun','arush',
  'arvind','aryan','ashish','ashok','ashvin','ashwin','aswin','atharv','atharva','atul',
  'aviral','ayaan','ayush','balaji','bala','balram','bharat','bhaskar','bhavesh','birendra',
  'bishnu','chaitanya','chandan','chandrashekhar','chetan','chirag','chiranjiv','daksh','daman','damodar',
  'darsh','darshan','deep','deepak','deepanshu','deeptanshu','dev','devang','devansh','devendra',
  'devraj','dhananjay','dhanush','dharmesh','dheeraj','dhiraj','dhruv','dhruvil','digvijay','dilip',
  'dinesh','divyanshu','ekansh','eklavya','eshan','falgun','farhan','ganesh','gaurav','gautam',
  'girish','gopal','govind','guhan','gulshan','gunjan','gurpreet','hardik','hari','harish',
  'hariom','harman','harsh','harshad','harshit','harshvardhan','hemant','himanshu','hiren','hitesh',
  'hrithik','hrishikesh','ishan','ishaan','jagdish','jai','jaidev','jatin','jay','jayant',
  'jayesh','jeevan','jigar','jitendra','jiten','kailash','kalpesh','kamal','kanak','kanishk',
  'kapil','karan','kartik','kartikeya','karthik','kaushal','kaustubh','keshav','kiaan','kian',
  'kiran','kishore','krish','krishna','krishnav','kunal','kundan','kushal','laksh','lakshay',
  'lakshman','lohith','lokesh','madhav','madhu','mahesh','mahir','manan','manav','mandar',
  'manish','manoj','manthan','manu','mayank','mayur','mehal','mihir','milan','mit',
  'mithil','mithun','mohan','mohit','mridul','mrigank','mukesh','mukul','murali','nachiket',
  'naman','nand','nandan','naresh','narendra','naveen','navneet','neeraj','neil','nihal',
  'nihar','nikhil','nilesh','niraj','niranjan','nirmal','nishant','nitesh','nitin','nityam',
  'om','omkar','pankaj','param','paras','parth','pavan','piyush','pradeep','praful',
  'prajwal','prakash','pramod','pranav','pranjal','prashant','prashanth','pratham','prathik','pratik',
  'pratyush','praveen','prem','prithvi','priyanshu','pulkit','puneet','punit','purushottam','raghav',
  'raghunath','rahul','raj','rajan','rajat','rajesh','rajiv','rakesh','ram','ramesh',
  'ramkumar','ranveer','ranvijay','rashi','ratan','rathod','raunak','ravi','ravindra','rehan',
  'reyansh','riddhiman','rishabh','rishi','ritesh','ritik','rituraj','rohit','ronak','roshan',
  'rudra','rudransh','sachin','saharsh','sahil','sai','saiyash','saket','sameer','samir','sampat',
  'sanchit','sandeep','sandesh','sanjay','sanjiv','sankalp','sant','santosh','sarang','sarthak',
  'satyam','saurabh','saurav','shaan','shailesh','shalin','shantanu','sharad','shashank','shashwat',
  'shaurya','shekhar','shivam','shivansh','shivraj','shreyas','shubham','shubhang','siddharth','siddhesh',
  'sohail','soham','somesh','sourav','srihari','srinath','srinivas','sudhir','sujay','sujit',
  'sukant','sumanth','sumeet','sumit','sundar','sunil','sunny','suraj','suresh','surya',
  'sushant','sushil','swapnil','swayam','tanay','tanish','tanmay','tarun','tejas','trilok',
  'trishul','tushar','uday','ujjwal','umesh','utkarsh','uttam','vaibhav','vamsi','varun',
  'vedant','venkat','venkatesh','venu','viaan','vibhav','vidyut','vijay','vikas','vikram',
  'vikrant','vinay','vineet','vipul','viraj','virendra','vishak','vishal','vishnu','vishwas',
  'vivaan','vivek','vyas','yash','yashwant','yogesh','yuvan','yuvraj',

  // ── Female Hindu names ──
  'aabha','aadhya','aahana','aaliya','aamira','aanya','aaradhya','aarathi','aarti','aasha',
  'aashika','aastha','aditi','ahana','aisha','akanksha','akshara','akshita','amala','amara',
  'amaya','ambika','amisha','amrita','amruta','anamika','ananya','angel','anindita','anisha',
  'anita','anjali','anjana','ankita','annapurna','anoushka','anshika','anuja','anusha','anushka',
  'anushree','aparna','archana','aria','arya','ashwini','avani','avantika','ayesha','bhagya',
  'bhanu','bharati','bhavana','bhavika','bhumi','bhumika','bindu','brinda','chaitra','champa',
  'chanda','chandana','chandini','chandni','charvi','chetana','chhavi','chithra','chitra','danya',
  'darpana','darshana','deepa','deepali','deepika','deshna','devika','devyani','dhanya','disha',
  'divya','divyanka','draupadi','durga','ekta','esha','eshani','gauri','gayathri','gayatri',
  'geeta','geetha','gita','gowri','grishma','harini','harshita','hemani','hetal','himani',
  'hina','indira','indu','ira','isha','ishani','ishita','ishwari','jagriti','janhvi',
  'janvi','jaya','jayanti','jhanvi','juhi','jyoti','jyotsna','kaavya','kajal','kajol',
  'kalpana','kamala','kamini','kanchan','kanika','kaveri','kavita','kavya','keerthi','khushi',
  'kiran','kirti','komal','kripa','kriti','kritika','kumari','kusum','lata','latha',
  'lavanya','laxmi','lekha','lila','madhavi','madhuri','maithili','maitri','mala','malini',
  'mallika','mamta','manasi','manisha','manjari','manjula','meena','meenakshi','meera','megha',
  'meghna','mili','minal','mira','mitali','mohini','mona','monika','mrinalini','mukta',
  'myra','naina','nalini','namita','namrata','nandini','nandita','nargis','navya','neelam',
  'neeraj','neesha','neeta','neha','niharika','nikita','nila','nilam','nimisha','nira',
  'nisha','nishita','nithya','nitya','noor','oviya','padma','pallavi','pankaja','parinita',
  'parvati','parveen','payal','pooja','poonam','poorvi','prachi','pragya','pranali','pranjali',
  'prarthana','prasanna','prathana','pratibha','preeti','prerna','prisha','priti','priya','priyadarshini',
  'priyanka','puja','rachana','rachita','radha','radhika','ragini','rajani','rajeshwari','rakhee',
  'rakhi','ramya','rani','ranjana','rashi','rashmi','raveena','reema','reena','rekha',
  'renuka','revathi','riddhi','rima','rinku','risha','rishika','rithika','ritika','ritu',
  'riya','rohini','roshni','ruhi','rupa','rupali','saanvi','sahana','sakshi','saloni',
  'samhita','samiksha','sampada','sandhya','sangeetha','sangita','sanjana','sanskriti','santoshi','sapna',
  'sara','saraswati','sarika','saritha','saroja','savita','savitri','sejal','shaila','shakti',
  'shalini','shanti','sharada','sharmila','sheetal','shikha','shilpa','shimla','shivani','shobha',
  'shraddha','shravani','shreya','shriya','shruti','shweta','siddhi','sita','smita','smriti',
  'sneha','snehal','sonali','sonam','sonia','sowmya','sreedevi','sridevi','srija','srinidhi',
  'subha','suchitra','sudha','sujata','sukanya','sulekha','sumathi','sumitra','sunaina','sunanda',
  'sunita','supriya','surbhi','sushma','swara','swarna','swati','tania','tanisha','tanya',
  'tara','tejaswi','tejaswini','thara','tina','trisha','tulsi','uma','urvashi','usha',
  'uttara','vaidehi','vaishnavi','vanita','varsha','vasudha','vedika','veena','vidya','vijaya',
  'vimala','vinita','vinutha','vishakha','vrinda','yamini','yashoda','yasmin','yukta','zara',

  // ── Muslim names common in India ──
  'aalim','aaqib','aariz','aasif','abdulla','abdullah','abid','adeel','adil','adnan',
  'afzal','ahad','ahmed','akhtar','akram','ali','altaf','aman','ameen','amir',
  'amjad','anees','aqeel','arbaaz','arif','arshad','asad','asghar','ashfaq','asif',
  'atif','ayaan','ayesha','azeem','aziz','babar','badr','bashir','bilal','danish',
  'ehsan','ejaz','fahad','fahim','faisal','faiz','faraz','farhan','farid','farooq',
  'farzana','fatima','firdaus','firoz','ghulam','habib','hafiz','haider','hameed','hamid',
  'hammad','hasan','hashim','hassan','hidayat','hussain','ibad','ibrahim','idris','iftikhar',
  'ikram','ilyas','imad','imran','inayat','iqbal','irfan','irshad','ismail','jaafer',
  'jabir','jamal','jameel','javed','junaid','kabir','kaleem','kamal','kamran','kashif',
  'khalid','khalil','khayyam','lateef','luqman','maalik','mahdi','majid','mansoor','maqbool',
  'masood','mehmood','moazzam','mohsin','mudassar','mueed','mujahid','mujtaba','munir','murad',
  'murtaza','musaddiq','mushtaq','mustafa','nabeel','nadeem','naeem','nafees','naim','naseer',
  'nasir','naveed','nawaz','nazeer','nazim','nisar','nouman','nusrat','owais','parvez',
  'pervez','qasim','rafiq','rahim','raja','rameez','rasheed','rashid','rauf','raza',
  'rehman','reyan','riaz','rizwan','saad','sabir','sadiq','saeed','safwan','saif',
  'sajid','saleem','salim','salman','sameer','samir','shabbir','shadab','shafiq','shahid',
  'shahrukh','shakeel','shakil','shamim','sharif','shoaib','shuaib','siddique','sulaiman','sultan',
  'tahir','talha','tariq','taufiq','toufiq','umar','umair','uzair','waheed','wahid',
  'wajid','waleed','waseem','wasim','yaqoob','yaseen','yasin','yusuf','zafar','zaheer',
  'zahid','zaid','zakir','zameer','zayd','zeeshan','zia','zohaib','zubair','zuhaib',

  // ── Female Muslim names ──
  'aafiya','aaliya','aasiya','afreen','afza','aisha','aliya','amina','amreen','anam',
  'areeba','arifa','asma','ayesha','azra','bushra','dilshad','fahmida','farheen','farida',
  'fathima','fauzia','firdous','gulnaz','habiba','hafsa','haleema','hamida','haseena','heena',
  'humera','husna','insha','iqra','ishrat','jahanara','jasmeen','khadija','khalida','kulsum',
  'laiba','lubna','mahira','mahjabeen','maimuna','mariam','maryam','meher','mehreen','mehwish',
  'muneera','muskaan','naaz','nabila','nadia','nafeesa','naheeda','naima','najma','nasreen',
  'naureen','nazia','naziya','nazma','nida','nighat','nikhat','noor','noora','noorjahan',
  'nusrat','qamar','rabia','rahila','raisa','rana','rashida','razia','rehana','roshan',
  'rukhsar','sabiha','sadiya','saeeda','safiya','saira','sajida','sakeena','salma','sameena',
  'samina','sana','saniya','sara','shabana','shabnam','shagufta','shahnaz','shahida','shaista',
  'shameem','shazia','suhana','sultana','tabassum','tahira','tasneem','uzma','waheeda','yasmin',
  'zahra','zainab','zakia','zara','zehra','zeenat','zohra','zubaida','zulekha',

  // ── Sikh names ──
  'amrit','amritpal','arjun','avneet','baljit','balwinder','bhupinder','charanjit','daljit','davinder',
  'dilpreet','gagandeep','gurbir','gurcharan','gurdas','gurdeep','gurinder','gurjeet','gurleen','gurmeet',
  'gurnam','gurpreet','gursimran','gurtej','gurwinder','hardeep','harinder','harjeet','harleen','harmeet',
  'harneet','harpreet','harsharan','harsimran','inderpreet','jagjit','jagjeet','jagmeet','jasdeep','jasmeet',
  'jaspal','jaspreet','jatinder','jobanpreet','jugraj','kamalpreet','kanwaljit','kuldeep','kulwinder','lakhbir',
  'lakhwinder','lavleen','lovepreet','mandeep','manjeet','manjit','manpreet','navdeep','navjot','navneet',
  'navpreet','nirbhai','onkar','palwinder','paramjeet','paramjit','pardeep','pavneet','prabhjot','prabhleen',
  'prabhmeet','preetinder','ramandeep','randeep','ranjit','ranjeet','ravinder','rupinder','sarabjit','satbir',
  'satinder','satnam','simran','simranjit','sukhbir','sukhjit','sukhleen','sukhman','sukhpreet','surinder',
  'tajinder','tanveer','tarvinder','tejinder','upinder',

  // ── South Indian names ──
  'aravind','ashwin','bala','balaji','chandra','dinesh','ganesh','gokul','gowtham','hariharan',
  'harikrishna','jayakumar','kailash','kalyan','karunakaran','kathir','kumaran','logesh','madhan','mahendran',
  'manivannan','manoj','murugan','nandha','navaneeth','prabhu','pradeep','prasad','prasanna','praveen',
  'raghu','rajkumar','rajesh','ramkumar','santhosh','saravanan','selva','senthil','shankar','shiva',
  'sivakumar','sriram','subramani','suresh','surya','thiru','varun','velu','venkat','venkatesh',
  'vetri','vijay','vimal','vinoth','vishwa',

  // ── Common Christian names in India ──
  'abraham','abin','aju','alex','alphonse','amos','anoop','antony','ashwin','austin',
  'benedict','benjamin','benny','christopher','cyril','daniel','david','dominic','elijah','emmanuel',
  'felix','francis','fredrick','george','gregory','isaac','jackson','jacob','james','jason',
  'jeremiah','joel','john','jonathan','joseph','joshua','kevin','lijo','mathew','michael',
  'moses','nicholas','noah','oliver','oscar','patrick','paul','peter','philip','prince',
  'raju','raphael','robin','samuel','sebastian','simon','stephen','thomas','timothy','victor',
  'vincent','william','xavier','zachary',

  // ── Common nicknames & short forms ──
  'abhi','adi','aku','amu','anu','ashu','bablu','bala','balu','bhau',
  'binu','bittu','boby','bonu','bublu','bunny','chiku','chintu','chotu','deva',
  'golu','guddu','gudu','jiju','kaka','kaku','kalu','kanha','kiki','kittu',
  'laddu','lucky','mahi','manu','miku','mimi','minu','mitu','monu','munna',
  'nani','nanu','neelu','niku','pappu','piku','pinku','pintu','priti','raju',
  'ramu','riku','rinku','ritu','sanju','shanu','shonu','sonu','tiku','tinku',
  'titu','toni','tonu','vicky','viku',

  // ── Short / International / Famous names ──
  'sam','altman','elon','musk','mark','zuck','zuckerberg','bill','gates','jeff','bezos','sundar','pichai','satya','nadella','steve','jobs','tim','cook',
]);

export const SURNAMES = new Set([
  // ── North Indian ──
  'acharya','adhikari','aggarwal','agrawal','ahuja','arora','bajaj','bajpai','banerjee','bansal',
  'basu','batra','bhagat','bhandari','bhardwaj','bhat','bhatia','bhatt','bhattacharya','bhattacharyya',
  'biswas','bose','chakraborty','chakravarty','chandra','chatterjee','chaturvedi','chaudhary','chaudhry','chauhan',
  'chopra','choudhury','dadhich','dalal','dalmia','das','dasgupta','datta','deshpande','desai',
  'devgan','dhawan','dixit','dubey','dutta','dwivedi','garg','ghosh','goel','gokhale',
  'goswami','gowda','grover','guha','gulati','gupta','iyer','jain','jaiswal','jha',
  'johar','joshi','juneja','kakkar','kamath','kamble','kangane','kapoor','kashyap','kataria',
  'kaul','kaushal','kerkar','khanna','khatri','kohli','kulkarni','kumar','kumari','kundu',
  'lal','luthra','mahajan','mahal','malhotra','malik','manchanda','mane','mangeshkar','mehrotra',
  'mehta','menon','mishra','misra','mistry','mittal','mohan','mohapatra','mukherjee','mukherji',
  'munde','murthy','murty','naidu','nair','nanda','nandi','narang','narayan','natarajan',
  'nath','nayak','nayar','nehru','oberoi','ojha','padmanabhan','pal','panda','pandey',
  'pandit','parekh','parikh','parmar','patel','pathak','patil','patnaik','paul','pillai',
  'poojari','prabhu','prasad','purohit','raina','raj','rajan','rajput','ram','ramachandran',
  'raman','ramaswamy','rana','ranganathan','rao','rastogi','rathore','raval','rawat','reddy',
  'sahay','saha','sahni','sahu','saini','saxena','sengupta','seth','sethi','shah',
  'shankaran','sharma','shenoy','shinde','shukla','sindhi','singh','sinha','sircar','sivakumar',
  'sodhi','soni','sood','srivastava','subramanian','subramaniam','sundaram','suri','swaminathan','swamy',
  'talwar','tandon','taneja','tewari','thakkar','thakur','thapar','tiwari','trehan','tripathi',
  'trivedi','tyagi','upadhyay','varma','varshney','venkataraman','venkatesh','verma','vij','vohra',
  'vora','wadhwa','walia','yadav',

  // ── South Indian ──
  'aiyar','ananth','anand','balakrishnan','chandrasekaran','chidambaram','devar','ganesan','gopalakrishnan',
  'hariharan','iyengar','iyer','jayaraman','kannan','karunakaran','krishnamurthy','krishnan','lakshmanan',
  'mani','meenakshi','mohan','murugesan','nagarajan','narasimhan','natarajan','padmanabhan','palaniswamy',
  'paramasivan','parthasarathy','pillai','raghavan','raghunathan','rajagopalan','rajakumar','ramakrishnan',
  'ramamurthy','ranganathan','sadasivam','seetharaman','shanmugam','srinivasan','subramanian','sundaresan',
  'swaminathan','thiagarajan','thyagarajan','varadarajan','veerasamy','venkataraman','venkatesan','viswanathan',

  // ── Marathi / Western Indian ──
  'abhyankar','apte','bhide','chavan','dange','deshpande','deshmukh','gadkari','ghatge','godbole',
  'jadhav','jog','joshi','kadam','kamble','karve','kelkar','kher','kokate','koparkar',
  'kulkarni','limaye','lotke','mahajan','mane','mhatre','mohol','mule','naik','nene',
  'ozha','panse','pawar','phadke','phule','prabhu','ranade','rane','salunkhe','sathe',
  'savant','shinde','shirke','tambe','tamhane','thackeray','thakre','tilak','wagh',

  // ── Bengali ──
  'banerjee','basu','bhattacharya','bose','chakraborty','chatterjee','das','dasgupta','datta','dey',
  'dutta','ganguly','ghosh','guha','kundu','maitra','majumdar','mitra','mukherjee','nandi',
  'pal','ray','roy','sarkar','sengupta',

  // ── Muslim surnames ──
  'ahmed','akhtar','ali','ansari','aziz','baig','bukhari','choudhary','farooqui','hasan',
  'hashmi','hussain','jafri','khan','kidwai','mahmood','mirza','mufti','naqvi','pathan',
  'qureshi','rahman','rizvi','saeed','sayeed','shaikh','sheikh','siddiqui','sultan','syed',
  'zaidi',

  // ── Sikh surnames ──
  'ahluwalia','arora','bajwa','bedi','bhullar','brar','cheema','dhaliwal','dhillon','gill',
  'grewal','johal','kalra','kaur','khaira','khanna','kohli','maan','malhi','mangat',
  'nagra','rai','randhawa','sahota','sandhu','sekhon','sethi','sidhu','singh','sohal',
  'uppal','virdi','virk','walia',
]);

export const COLLEGE_NAMES = new Set([
  'iit','iim','nit','bits','vit','srm','manipal','amity','lpu','christ',
  'symbiosis','kiit','mit','anna','jadavpur','jnu','bhu','du','amu','presidency',
  'fergusson','xavier','loyola','stephens','hansraj','ramjas','lsr','gargi','miranda','hindu',
  'khalsa','dayal','kirori','venky','rvce','pesit','bmsce','msrit','dsce','uvce',
  'coep','vjti','ict','iiser','iiit','iisc','thapar','pec','nsut','dtu',
  'igdtuw','jiit','bennett','ashoka','plaksha','krea','flame','nmims','svnit','mnit',
  'mnnit','vnit','iiitd','iiitb','iiith','iiitm','iiitdm','isb','xlri','fms',
  'iift','spjimr','jbims','sibm','scmhrd','tapmi','great','lakes','fore','imu',
  'spit','spce','djsce','somaiya','tsec','vesit','pict','wpu','ait','sit','viit','cummins','bvcoe','mait',
]);

export const CITY_NAMES = new Set([
  'mumbai','delhi','bangalore','bengaluru','hyderabad','ahmedabad','chennai','kolkata','pune','jaipur',
  'lucknow','kanpur','nagpur','indore','thane','bhopal','visakhapatnam','vizag','patna','vadodara',
  'ghaziabad','ludhiana','agra','nashik','faridabad','meerut','rajkot','varanasi','srinagar','aurangabad',
  'dhanbad','amritsar','allahabad','prayagraj','ranchi','howrah','coimbatore','jabalpur','gwalior','vijayawada',
  'jodhpur','madurai','raipur','kota','chandigarh','guwahati','solapur','hubli','mysore','mysuru',
  'tiruchirappalli','trichy','bareilly','aligarh','tiruppur','moradabad','gorakhpur','bhubaneswar','dehradun',
  'noida','gurgaon','gurugram','navi','thane','andheri','bandra','powai','juhu',
  
  // ── Mumbai & Navi Mumbai & Thane Suburbs ──
  'airoli','ghansoli','koparkhairane','vashi','nerul','belapur','kharghar','seawoods','panvel','ulwe','taloja','kamothe',
  'ghodbunder','majiwada','kolshet','pokhran','vartak','kalwa','kopri','kasarvadavali',
  'dharavi','chembur','dadar','borivali','kandivali','malad','goregaon','sion','kurla','ghatkopar','mulund','kalyan','dombivli','mumbra','byculla','colaba','worli','parel','wadala','santacruz','vileparle','jogeshwari','dahisar','bhayandar','mira','vasai','virar',

  // ── Pune Suburbs ──
  'kothrud','baner','aundh','hinjewadi','wakad','viman','kalyani','koregaon','hadapsar','magarpatta','wagholi','kharadi',

  // ── Bangalore Suburbs ──
  'yelahanka','hebbal','jakkur','sahakar','jayanagar','jpnagar','banashankari','btmlayout','btm','bannerghatta','electronic','indiranagar','whitefield','marathahalli','sarjapur','rajajinagar','vijayanagar','kengeri','nagarbhavi',

  // ── Delhi NCR Suburbs & Areas ──
  'vasant','kunj','saket','malviya','greater','kailash','lajpat','chhatarpur','dwarka','uttam','tilak','paschim','patel','rohini','ashok','pitampura','burari','connaught','chanakyapuri',
]);

export const SUBJECT_NAMES = new Set([
  'dsa', 'dbms', 'oops', 'os', 'cn', 'toc', 'flat', 'm1', 'm2', 'm3', 'm4',
  'physics', 'chemistry', 'maths', 'math', 'mathematics', 'biology', 'history', 'geography', 'civics', 'economics',
  'mechanics', 'thermodynamics', 'electronics', 'electrical', 'bee', 'cad', 'eg',
  'java', 'python', 'cpp', 'javascript', 'react', 'angular', 'flutter', 'android', 'web', 'cloud', 'devops',
  'ml', 'ai', 'aptitude', 'kotlin', 'swift', 'microprocessor', 'embedded', 'vlsi', 'dsp', 'signals', 'systems',
  'automata', 'calculus', 'algebra', 'trigonometry', 'geometry', 'statistics', 'probability'
]);
