import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center',
        paddingTop: '10%',
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    //   brødtekst
    bodyText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#2c3e50',
        textAlign: 'center',
    },

    //   knapper
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 40,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    container: {
        paddingTop: '10%',
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#6DD5FA',
    },
    professionItem: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        width: '100%',
    },
    professionName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#34495e',
    },
    professionDetails: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 10,
    },
    selectButton: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginTop: '20%',
    },
    confirmText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#2c3e50',
        textAlign: 'center',
    },
    confirmButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    confirmButton: {
        backgroundColor: '#27ae60',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    listContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },

    // Styles related to uploadPayslip.tsx

    uploadImage: {
        width: 250,
        height: 250,
        marginVertical: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    uploadLoader: {
        marginTop: 20,
    },



    // login page
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '100%',
    },
    linkContainer: {
        alignItems: 'center',
    },

    // user profile
    modalView: {
        marginTop: '10%',
        margin: 20,
        height: '50%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    // map
    mapButtonsContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
  modalView2: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        elevation: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    
});

export default globalStyles;
