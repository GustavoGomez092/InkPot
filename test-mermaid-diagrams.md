# Test Document: Valid Mermaid Diagrams

This document contains multiple valid Mermaid diagrams for testing PDF export.

## 1. Simple Flowchart

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
```
*Figure 1: Basic decision flowchart*

## 2. Sequence Diagram

```mermaid
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!
```
*Figure 2: Simple conversation sequence*

## 3. Class Diagram

```mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    class Duck{
        +String beakColor
        +swim()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
```
*Figure 3: Animal class hierarchy*

## 4. Pie Chart

```mermaid
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
```
*Figure 4: Pet adoption statistics*

## 5. Git Graph

```mermaid
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
```
*Figure 5: Git branching workflow*

## Conclusion

All diagrams above should render correctly in the PDF export.
