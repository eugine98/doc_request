// import { create } from 'zustand';

// interface EmployeeData {
//     age: string;
//     contacts_home_telephone: string;
//     contacts_mobile: string;
//     date_of_birth: string;
//     department: string;
//     divisions: string;
//     emergency_address: string;
//     emergency_home_telephone: string;
//     emergency_mobile: string;
//     emergency_name: string;
//     emergency_relationship: string;
//     emergency_work_telephone: string;
//     first_name: string;
//     gender: string;
//     idno: string;
//     job_job_company: string;
//     job_job_title: string;
//     jobcode: string;
//     jobrole: string;
//     joined_date: string;
//     last_name: string;
//     middle_name: string;
//     myaddress: string;
//     other_email: string;
//     pagibig: string;
//     philhealth: string;
//     picture_location: string;
//     project: string;
//     sss: string;
//     tin: string;
//     work_email: string;
// }

// interface EmpDataStore {
//     empData: EmployeeData;
//     setEmpData: (data: EmployeeData) => void;
// }

// const useStore = create<EmpDataStore>((set) => ({
//     empData: {
//         age: '',
//         contacts_home_telephone: '',
//         contacts_mobile: '',
//         date_of_birth: '',
//         department: '',
//         divisions: '',
//         emergency_address: '',
//         emergency_home_telephone: '',
//         emergency_mobile: '',
//         emergency_name: '',
//         emergency_relationship: '',
//         emergency_work_telephone: '',
//         first_name: '',
//         gender: '',
//         idno: '',
//         job_job_company: '',
//         job_job_title: '',
//         jobcode: '',
//         jobrole: '',
//         joined_date: '',
//         last_name: '',
//         middle_name: '',
//         myaddress: '',
//         other_email: '',
//         pagibig: '',
//         philhealth: '',
//         picture_location: '',
//         project: '',
//         sss: '',
//         tin: '',
//         work_email: '',
//     },
//     setEmpData: (data) => set({ empData: data }),
// }));

// END




//WORKING
// export default useStore;
// import { create } from 'zustand';

// // Define the EmployeeData interface
// interface EmployeeData {
//     // age: string;
//     // contacts_home_telephone: string;
//     // contacts_mobile: string;
//     // date_of_birth: string;
//     // department: string;
//     // divisions: string;
//     // emergency_address: string;
//     // emergency_home_telephone: string;
//     // emergency_mobile: string;
//     // emergency_name: string;
//     // emergency_relationship: string;
//     // emergency_work_telephone: string;
//     first_name: string;
//     // gender: string;
//     idno: string;
//     // job_job_company: string;
//     job_job_title: string;
//     // jobcode: string;
//     // jobrole: string;
//     // joined_date: string;
//     last_name: string;
//     // middle_name: string;
//     // myaddress: string;
//     // other_email: string;
//     // pagibig: string;
//     // philhealth: string;
//     picture_location: string;
//     // project: string;
//     // sss: string;
//     // tin: string;
//     // work_email: string;
// }

// // Define the store state type
// interface EmpDataStore {
//     empData: EmployeeData;
//     setEmpData: (data: EmployeeData) => Promise<void>;
// }

// // Encoding and decoding functions
// const encode = (data: string) => btoa(data);
// const decode = (data: string) => atob(data);

// // IndexedDB functions
// const openDatabase = async () => {
//     return new Promise<IDBDatabase>((resolve, reject) => {
//         const request = indexedDB.open('myDatabase', 1);

//         request.onupgradeneeded = () => {
//             const db = request.result;
//             db.createObjectStore('empDataStore', { keyPath: 'id' });
//         };

//         request.onsuccess = () => resolve(request.result);
//         request.onerror = () => reject(request.error);
//     });
// };

// const saveData = async (data: EmployeeData) => {
//     const db = await openDatabase();
//     const transaction = db.transaction('empDataStore', 'readwrite');
//     const store = transaction.objectStore('empDataStore');
//     store.put({ id: 'empData', data: encode(JSON.stringify(data)) });
// };

// const getData = async (): Promise<EmployeeData> => {
//     const db = await openDatabase();
//     const transaction = db.transaction('empDataStore', 'readonly');
//     const store = transaction.objectStore('empDataStore');
//     const request = store.get('empData');

//     return new Promise((resolve) => {
//         request.onsuccess = () => {
//             const result = request.result;
//             resolve(result ? JSON.parse(decode(result.data)) : {
//                 age: '',
//                 contacts_home_telephone: '',
//                 contacts_mobile: '',
//                 date_of_birth: '',
//             });
//         };
//     });
// };

// // Create the Zustand store
// const useStore = create<EmpDataStore>((set) => ({
//     empData: {
//                 // age: '',
//                 // contacts_home_telephone: '',
//                 // contacts_mobile: '',
//                 // date_of_birth: '',
//                 // department: '',
//                 // divisions: '',
//                 // emergency_address: '',
//                 // emergency_home_telephone: '',
//                 // emergency_mobile: '',
//                 // emergency_name: '',
//                 // emergency_relationship: '',
//                 // emergency_work_telephone: '',
//                 first_name: '',
//                 // gender: '',
//                 idno: '',
//                 // job_job_company: '',
//                 job_job_title: '',
//                 // jobcode: '',
//                 // jobrole: '',
//                 // joined_date: '',
//                 last_name: '',
//                 // middle_name: '',
//                 // myaddress: '',
//                 // other_email: '',
//                 // pagibig: '',
//                 // philhealth: '',
//                 picture_location: '',
//                 // project: '',
//                 // sss: '',
//                 // tin: '',
//                 // work_email: '',
//     }, // Initial state (can be overridden once data is loaded)
//     setEmpData: async (data) => {
//         await saveData(data); // Save to IndexedDB
//         set({ empData: data }); // Update state
//     },
// }));

// const loadInitialData = async () => {
//     const initialData = await getData();
//     useStore.setState({ empData: initialData });
// };

// // Call the function to load initial data
// loadInitialData();

// export default useStore;

//NEW
import { create } from 'zustand';

// Define the EmployeeData interface
interface EmployeeData {
    status: string;
    first_name: string;
    idno: string;
    job_job_title: string;
    last_name: string;
    picture_location: string;
    type: string;
}

// Define the store state type
interface EmpDataStore {
    empData: EmployeeData;
    setEmpData: (data: EmployeeData) => Promise<void>;
    deleteEmpData: () => Promise<void>; // Method for deletion
}

// Encoding and decoding functions
const encode = (data: string) => btoa(data);
const decode = (data: string) => atob(data);

// IndexedDB functions
const openDatabase = async () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('myDatabase', 1);

        request.onupgradeneeded = () => {
            const db = request.result;
            db.createObjectStore('empDataStore', { keyPath: 'id' });
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

const saveData = async (data: EmployeeData) => {
    const db = await openDatabase();
    const transaction = db.transaction('empDataStore', 'readwrite');
    const store = transaction.objectStore('empDataStore');
    store.put({ id: 'empData', data: encode(JSON.stringify(data)) });
};

const getData = async (): Promise<EmployeeData> => {
    const db = await openDatabase();
    const transaction = db.transaction('empDataStore', 'readonly');
    const store = transaction.objectStore('empDataStore');
    const request = store.get('empData');

    return new Promise((resolve) => {
        request.onsuccess = () => {
            const result = request.result;
            resolve(result ? JSON.parse(decode(result.data)) : {
                status: '',
                first_name: '',
                idno: '',
                job_job_title: '',
                last_name: '',
                picture_location: '',
                type: '',
            });
        };
    });
};

// Delete function
const deleteData = async () => {
    const db = await openDatabase();
    const transaction = db.transaction('empDataStore', 'readwrite');
    const store = transaction.objectStore('empDataStore');
    store.delete('empData'); // Remove the data with the key 'empData'
};

// Create the Zustand store
const useStore = create<EmpDataStore>((set) => ({
    empData: {
        status: '',
        first_name: '',
        idno: '',
        job_job_title: '',
        last_name: '',
        picture_location: '',
        type: '',
    }, // Initial state (can be overridden once data is loaded)
    setEmpData: async (data) => {
        await saveData(data); // Save to IndexedDB
        set({ empData: data }); // Update state
    },
    deleteEmpData: async () => {
        await deleteData(); // Remove from IndexedDB
        set({ empData: { status: '', first_name: '', idno: '', job_job_title: '', last_name: '', picture_location: '', type: '', } }); // Reset state
    },
}));

const loadInitialData = async () => {
    const initialData = await getData();
    useStore.setState({ empData: initialData });
};

// Call the function to load initial data
loadInitialData();

export default useStore;


