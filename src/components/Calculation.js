import React from "react";
import { useState } from "react";
import { SafeAreaView , StyleSheet } from "react-native";


const Calculation = () => {

    const [salary, salaryInput] = useState(0);


    const SalarySavings = () => {
        const Save = salary / 10 * 2;
        const Needs = salary / 10 * 5;
        const Wants = salary / 10 * 3;
    }

    const OveralLoanEligibility = () => {
         const Eligibility = salary * 0.6;
    }

    return(
        <SafeAreaView>
            <Text style = {styles.title}>Life Helper</Text>

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    title: {
      width: '100%',
      textAlign: 'center',
      fontSize: 36,
      fontWeight: 'bold',
      color: '#1C51CD',
    }
  });
      
   


export default Calculation;

