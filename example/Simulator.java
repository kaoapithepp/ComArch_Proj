import java.io.*;
import java.util.Scanner;
import java.util.ArrayList;


public class Simulator {

    public static void ReadFile(ArrayList<String> mem){
        try{
            File FileText = new File("MachineLanguage.txt");
            Scanner myReader = new Scanner(FileText);
            while (myReader.hasNextLine()) {
                mem.add(myReader.nextLine());
                // System.out.println(mem[indexArray]);
            }
            myReader.close();
        }
        catch (FileNotFoundException e){
            System.out.println("An error occureed.");
            e.printStackTrace();
        }
        
    }

    public static int CountLine(){
        int lines = 0;
        try{
            BufferedReader reader = new BufferedReader(new FileReader("MachineLanguage.txt"));
            while (reader.readLine() != null) lines++;
            reader.close(); 
            throw new IOException();
        }
        catch (FileNotFoundException e){
            System.out.println("An error occureed.");
            e.printStackTrace();
        }
        catch(IOException e) {

       }
        return lines;
    }

    public static int BinaryToDecimal(String bin){
        int Decimal = Integer.parseInt(bin,2);
        // System.out.println(Binary);
        // String Bi = Integer.toString(Decimal);
        return Decimal;
    }

    public static String BinaryToDecimalOffset(String bin){
        int Dec = Integer.parseInt(bin,2);
        char CheckBit = bin.charAt(0); //Check First Bit if 1
        // System.out.println(CheckBit);
        if(CheckBit == '1'){
            Dec = 65536 - Dec;
            Dec = Dec*(-1);
        }
        // System.out.println(Dec);
        String result = String.valueOf(Dec);
        return result;
    }
    
    public static String DecimalToBinary3bits(String dec){
        int index = 2;
        int[] bin3 = {0,0,0};
        int Decimal = Integer.parseInt(dec);
        
        while(Decimal > 0){
            bin3[index] = Decimal%2;
            Decimal = Decimal/2;
            index = index-1;

        }

        // int i = 0; //test case
        // while(i != 3){
        //     System.out.print(bin3[i]);
        //     i++;
        // }
        
        return convert(bin3);
    }

    public static String DecimalToBinary32bits(String dec){
        int index = 31;
        int[] bin32 = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
        int Decimal = Integer.parseInt(dec);
        
        while(Decimal > 0){
            bin32[index] = Decimal%2;
            Decimal = Decimal/2;
            index = index-1;

        }

        // int i = 0; //test case
        // while(i != 32){
        //     System.out.print(bin32[i]);
        //     i++;
        // }
        
        return convert(bin32);
    }

    public static String DecimalToBinary25bits(String dec){
        int index = 24;
        int[] bin25 = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
        int Decimal = Integer.parseInt(dec);
        if(Decimal < 0){
            Decimal = Decimal*(-1);
        }
        while(Decimal > 0){
            bin25[index] = Decimal%2;
            Decimal = Decimal/2;
            index = index-1;
        }

        // int i = 0; //test case
        // while(i != 25){
        //     System.out.print(bin25[i]);
        //     i++;
        // }
        
        return convert(bin25);
    }

    public static String DecimaltoBinary25Offset(String dec){ //2'complements
        int Decimal = Integer.parseInt(dec);
        String Binary25;
        if(Decimal >= 0){
            Binary25 = DecimalToBinary25bits(dec);
        }
        else{
            Decimal = Decimal * (-1);
            Binary25 = DecimalToBinary25bits(dec);
            // System.out.println(twosCompliment(Binary25));      
            return twosCompliment((Binary25));
        }
        return Binary25;
    }

    public static String convert(int[] list){ //convert in array to String
        StringBuilder builder = new StringBuilder();
        for(int num : list){
            builder.append(num);
        }
        return builder.toString();
    }

    public static String twosCompliment(String bin) {
        String twos = "", ones = "";

        for (int i = 0; i < bin.length(); i++) {
            ones += flip(bin.charAt(i));
        }
        // int number0 = Integer.parseInt(ones, 2);
        StringBuilder builder = new StringBuilder(ones);
        boolean b = false;
        for (int i = ones.length() - 1; i > 0; i--) {
            if (ones.charAt(i) == '1') {
                builder.setCharAt(i, '0');
            } else {
                builder.setCharAt(i, '1');
                b = true;
                break;
            }
        }
        if (!b)
            builder.append("1", 0, 7);

        twos = builder.toString();

        return twos;
    }

    public static char flip(char c) {
        return (c == '0') ? '1' : '0';
    }
    
    

    public static void printState(int pc,ArrayList<String> mem,int[] reg){
        int i = 0;
        int j = 0;
        System.out.println("@@@");
        System.out.println("state:");
        System.out.println("          pc " + pc);
        System.out.println("          memory: ");
        while(i < mem.size()){
            System.out.println("              mem[ " + i + " ] " + mem.get(i));
            i = i+1;
        }
        System.out.println("          registers: ");
        while(j < reg.length){
            System.out.println("              reg[ " + j + " ] " + reg[j]);
            j = j+1;
        }
        System.out.println("end state");
        System.out.println("");
    }



    public static void main(String[] args){
        int pc = 0;
        int inst = 0;
        // int Count = CountLine();
        String dest;
        ArrayList<String> mem = new ArrayList<String>();
        int reg[] = {0,0,0,0,0,0,0,0};
        ReadFile(mem);
        printState(pc,mem,reg);
        while(pc < mem.size()){

            //print Instruction count
            inst = inst + 1;
            System.out.println("Instruction count = " + inst);
            

            //convert input from decimal to binary
            String m = DecimaltoBinary25Offset(mem.get(pc));
            String opcode = String.valueOf(m.charAt(0)) + String.valueOf(m.charAt(1)) + String.valueOf(m.charAt(2));
            String A = String.valueOf(m.charAt(3)) + String.valueOf(m.charAt(4)) + String.valueOf(m.charAt(5));
            String B = String.valueOf(m.charAt(6)) + String.valueOf(m.charAt(7)) + String.valueOf(m.charAt(8));

            int indexA = BinaryToDecimal(A);
            int indexB = BinaryToDecimal(B);
            // System.out.println("pc = " + pc);
            // System.out.println("m = " + m);
            // System.out.println("opcode = " + opcode);
            // System.out.println("A = " +A);
            // System.out.println("B = " +B);
            // System.out.println("indexA = " + indexA);
            // System.out.println("indexB = " + indexB);

            // for(int i = 0; i < mem.size(); i++){
            //     System.out.println(mem.size());
            //     System.out.println(mem.get(i));
            // }

            if(opcode.equals("000")) //add
            {
                dest = String.valueOf(m.charAt(22)) + String.valueOf(m.charAt(23)) + String.valueOf(m.charAt(24));
                int indexDest = BinaryToDecimal(dest);
                reg[indexDest] = reg[indexA] + reg[indexB];
                pc = pc+1;
            }

            else if(opcode.equals("001")) //nand
            {
                dest = String.valueOf(m.charAt(22)) + String.valueOf(m.charAt(23)) + String.valueOf(m.charAt(24));
                int indexDest = BinaryToDecimal(dest);
                
                String bit32RegA = DecimalToBinary32bits(String.valueOf(reg[indexA]));
                String bit32RegB = DecimalToBinary32bits(String.valueOf(reg[indexB]));
                //And bit
                String comparison = "";
                for(int i = 0; i < bit32RegA.length()-1 ; i++){
                    if(bit32RegA.charAt(i) == bit32RegB.charAt(i) && bit32RegA.charAt(i) != '0'){
                        comparison = comparison+"1";
                    }
                    else{
                        comparison = comparison+"0";
                    }
                }

                //reverse bit
                String nand = "";
                for (int i = 0; i < comparison.length(); i++) { 
                    nand += flip(comparison.charAt(i));
                }

                //Keep in Reg[dest]
                reg[indexDest] = Integer.parseInt(BinaryToDecimalOffset(nand));
                pc = pc+1;
            }

            else if(opcode.equals("010")) //lw
            {
                String off = String.valueOf(m.charAt(9)) + String.valueOf(m.charAt(10)) + String.valueOf(m.charAt(11)) + 
                             String.valueOf(m.charAt(12)) + String.valueOf(m.charAt(13)) + String.valueOf(m.charAt(14)) + 
                             String.valueOf(m.charAt(15)) + String.valueOf(m.charAt(16)) + String.valueOf(m.charAt(17)) +
                             String.valueOf(m.charAt(18)) + String.valueOf(m.charAt(19)) + String.valueOf(m.charAt(20)) +
                             String.valueOf(m.charAt(21)) + String.valueOf(m.charAt(22)) + String.valueOf(m.charAt(23)) +
                             String.valueOf(m.charAt(24));
                off = BinaryToDecimalOffset(off);
                int ValueRegA = reg[indexA];
                int offset = Integer.parseInt(off);
                reg[indexB] = Integer.parseInt(mem.get(ValueRegA + offset));
                pc = pc+1;
            }

            else if(opcode.equals("011")) //sw
            {
                String off = String.valueOf(m.charAt(9)) + String.valueOf(m.charAt(10)) + String.valueOf(m.charAt(11)) + 
                             String.valueOf(m.charAt(12)) + String.valueOf(m.charAt(13)) + String.valueOf(m.charAt(14)) + 
                             String.valueOf(m.charAt(15)) + String.valueOf(m.charAt(16)) + String.valueOf(m.charAt(17)) +
                             String.valueOf(m.charAt(18)) + String.valueOf(m.charAt(19)) + String.valueOf(m.charAt(20)) +
                             String.valueOf(m.charAt(21)) + String.valueOf(m.charAt(22)) + String.valueOf(m.charAt(23)) +
                             String.valueOf(m.charAt(24));
                off = BinaryToDecimalOffset(off);
                int ValueRegA = reg[indexA];
                int offset = Integer.parseInt(off);
                if((ValueRegA + offset) >= mem.size()){
                    // mem.add(String.valueOf(reg[indexB]));
                    mem.add(ValueRegA + offset, String.valueOf(reg[indexB]));
                }
                else{
                    mem.add(ValueRegA + offset, String.valueOf(reg[indexB]));
                }
                pc = pc+1;
            }

            else if(opcode.equals("100")) //beq
            {
                String off = String.valueOf(m.charAt(9)) + String.valueOf(m.charAt(10)) + String.valueOf(m.charAt(11)) + 
                             String.valueOf(m.charAt(12)) + String.valueOf(m.charAt(13)) + String.valueOf(m.charAt(14)) + 
                             String.valueOf(m.charAt(15)) + String.valueOf(m.charAt(16)) + String.valueOf(m.charAt(17)) +
                             String.valueOf(m.charAt(18)) + String.valueOf(m.charAt(19)) + String.valueOf(m.charAt(20)) +
                             String.valueOf(m.charAt(21)) + String.valueOf(m.charAt(22)) + String.valueOf(m.charAt(23)) +
                             String.valueOf(m.charAt(24));
                off = BinaryToDecimalOffset(off);
                int offset = Integer.parseInt(off);
                pc = pc+1;
                //jump
                if(reg[indexA] == reg[indexB]){
                    pc = pc + offset;
                    System.out.println(pc);
                }
                printState(pc,mem,reg);

                continue;
            }

            else if(opcode.equals("101")) //jalr
            {
                pc = pc+1;
                reg[indexB] = pc;
                printState(pc,mem,reg);

                //jump
                if(indexA != indexB){
                    pc = reg[indexA];
                }

                continue;
            }

            else if(opcode.equals("110")) //halt
            {
                pc = pc+1;
                printState(pc,mem,reg);
                break;
            }

            else if(opcode.equals("111")) //noop
            {
                pc = pc + 1;
            }
            
            printState(pc,mem,reg);

        }
    }

}